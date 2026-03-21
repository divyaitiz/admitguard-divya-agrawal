import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { CheckCircle, XCircle } from "lucide-react";
import { Slider } from "./ui/slider";
import { useForm } from "../context/FormContext";

interface Step6Props {
  onNext: () => void;
  onBack: () => void;
}

export function Step6Screening({ onNext, onBack }: Step6Props) {
  const { formData, updateField } = useForm();
  const cutoff = 60;
  const score = parseInt(formData.screeningScore) || 0;
  const isPassing = score >= cutoff;

  const handleScoreChange = (value: string) => {
    updateField("screeningScore", value);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Screening Evaluation</h2>

      <div className="space-y-6">
        <div>
          <Label htmlFor="screeningScore">Screening Test Score *</Label>
          <Input
            id="screeningScore"
            type="number"
            min="0"
            max="100"
            placeholder="Enter score (0-100)"
            className="mt-1.5"
            value={formData.screeningScore}
            onChange={(e) => handleScoreChange(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Score obtained out of 100
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium">Score Visualization</span>
            <span className="text-2xl font-semibold text-blue-600">{score}/100</span>
          </div>
          <Slider
            value={[score]}
            max={100}
            step={1}
            className="mb-4"
            disabled
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0</span>
            <span className="font-medium text-orange-600">Cutoff: {cutoff}</span>
            <span>100</span>
          </div>
        </div>

        {isPassing ? (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Qualified for Interview</strong>
              <br />
              Your score ({score}) exceeds the cutoff ({cutoff}). You will proceed to the interview stage.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Did Not Qualify</strong>
              <br />
              Your score ({score}) is below the cutoff ({cutoff}). Unfortunately, you cannot proceed further.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between pt-4">
          <Button onClick={onBack} variant="outline">
            Back
          </Button>
          <Button onClick={onNext} className="px-8" disabled={!isPassing}>
            Next: Interview Decision
          </Button>
        </div>
      </div>
    </div>
  );
}

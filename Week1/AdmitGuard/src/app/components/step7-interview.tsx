import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { useForm } from "../context/FormContext";

interface Step7Props {
  onNext: () => void;
  onBack: () => void;
}

export function Step7Interview({ onNext, onBack }: Step7Props) {
  const { formData, updateField } = useForm();

  const handleStatusChange = (value: string) => {
    updateField("interviewStatus", value);
  };

  const handleFeedbackChange = (feedback: string) => {
    updateField("screeningFeedback", feedback);
  };
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Interview Decision</h2>

      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>For Admin/Interviewer Use</strong>
            <br />
            Record the interview outcome and provide feedback for the candidate.
          </p>
        </div>

        <div>
          <Label>Interview Status *</Label>
          <RadioGroup value={formData.interviewStatus} onValueChange={handleStatusChange} className="mt-3 space-y-3">
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="cleared" id="cleared" />
              <Label htmlFor="cleared" className="flex-1 cursor-pointer font-normal">
                <div className="flex items-center gap-2">
                  <span>Cleared</span>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    Qualified
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Candidate performed well and is eligible for admission
                </p>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="waitlisted" id="waitlisted" />
              <Label htmlFor="waitlisted" className="flex-1 cursor-pointer font-normal">
                <div className="flex items-center gap-2">
                  <span>Waitlisted</span>
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    Pending
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Candidate may be considered based on seat availability
                </p>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="rejected" id="rejected" />
              <Label htmlFor="rejected" className="flex-1 cursor-pointer font-normal">
                <div className="flex items-center gap-2">
                  <span>Rejected</span>
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                    Not Qualified
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Candidate did not meet the interview criteria
                </p>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="feedback">Interview Feedback</Label>
          <Textarea
            id="feedback"
            placeholder="Enter detailed feedback about the candidate's performance..."
            rows={4}
            className="mt-1.5"
            value={formData.screeningFeedback}
            onChange={(e) => handleFeedbackChange(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional: Provide constructive feedback for internal records
          </p>
        </div>

        <div className="flex justify-between pt-4">
          <Button onClick={onBack} variant="outline">
            Back
          </Button>
          <Button onClick={onNext} className="px-8">
            Next: Admission Decision
          </Button>
        </div>
      </div>
    </div>
  );
}

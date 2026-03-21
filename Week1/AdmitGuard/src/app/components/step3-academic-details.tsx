import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useForm } from "../context/FormContext";

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
}

export function Step3AcademicDetails({ onNext, onBack }: Step3Props) {
  const { formData, updateField } = useForm();
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Academic Details</h2>

      <div className="space-y-6">
        <div>
          <Label htmlFor="qualification">Highest Qualification *</Label>
          <Select value={formData.qualification} onValueChange={(value) => updateField("qualification", value)}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select your qualification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="btech">B.Tech</SelectItem>
              <SelectItem value="be">B.E.</SelectItem>
              <SelectItem value="bsc">B.Sc</SelectItem>
              <SelectItem value="bca">BCA</SelectItem>
              <SelectItem value="mtech">M.Tech</SelectItem>
              <SelectItem value="msc">M.Sc</SelectItem>
              <SelectItem value="mca">MCA</SelectItem>
              <SelectItem value="mba">MBA</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="gradYear">Graduation Year *</Label>
          <Select value={formData.gradYear} onValueChange={(value) => updateField("gradYear", value)}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 11 }, (_, i) => 2025 - i).map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Score Type *</Label>
          <RadioGroup defaultValue="percentage" className="mt-3 space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="percentage" id="percentage" />
              <Label htmlFor="percentage" className="font-normal cursor-pointer">
                Percentage
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cgpa" id="cgpa" />
              <Label htmlFor="cgpa" className="font-normal cursor-pointer">
                CGPA
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="score">Percentage / CGPA *</Label>
          <Input
            id="score"
            type="number"
            step="0.01"
            placeholder="Enter your score"
            className="mt-1.5"
            value={formData.cgpa}
            onChange={(e) => updateField("cgpa", e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            For CGPA: Scale of 10 | For Percentage: 0-100
          </p>
        </div>

        <div className="flex justify-between pt-4">
          <Button onClick={onBack} variant="outline">
            Back
          </Button>
          <Button onClick={onNext} className="px-8">
            Next: Upload Documents
          </Button>
        </div>
      </div>
    </div>
  );
}

import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Upload, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { useForm } from "../context/FormContext";
import { useState } from "react";

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
}

export function Step2IdentityVerification({ onNext, onBack }: Step2Props) {
  const { formData, updateField } = useForm();
  const [uploaded, setUploaded] = useState(false);
  const showValidation = false; // Toggle to true to see validation UI

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateField("identityDocument", file);
      updateField("identityDocumentName", file.name);
      setUploaded(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Identity Verification</h2>

      <div className="space-y-6">
        <div>
          <Label>Upload Government ID Proof *</Label>
          <p className="text-sm text-gray-500 mb-3">
            Accepted: Aadhaar Card, Passport, Driving License, Voter ID
          </p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
              id="identity-upload"
            />
            <label htmlFor="identity-upload" className="cursor-pointer block">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400">
                PDF, JPG, PNG (Max 5MB)
              </p>
            </label>
          </div>
          {formData.identityDocumentName && (
            <p className="text-sm text-green-600 mt-2">
              ✓ {formData.identityDocumentName}
            </p>
          )}
        </div>

        {showValidation && (
          <div className="space-y-4 mt-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-3">Validation Results</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Name Match: Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Date of Birth: Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm">ID Number: Mismatch Detected</span>
                </div>
              </div>
            </div>

            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Document verification failed. Please check your details or contact helpdesk.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button onClick={onBack} variant="outline">
            Back
          </Button>
          <Button onClick={onNext} className="px-8">
            Next: Academic Details
          </Button>
        </div>
      </div>
    </div>
  );
}

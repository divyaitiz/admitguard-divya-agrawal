import { Button } from "./ui/button";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useForm } from "../context/FormContext";

interface Step5Props {
  onNext: () => void;
  onBack: () => void;
}

export function Step5AIValidation({ onNext, onBack }: Step5Props) {
  const { formData, updateField } = useForm();
  const isValidating = false;
  const hasIssues = formData.aiValidationStatus === "failed";

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">AI-Based Integrity Validation</h2>

      {isValidating ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-lg font-medium">Validating Documents...</p>
          <p className="text-sm text-gray-500 mt-2">
            Cross-checking information across all uploaded documents
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="font-medium mb-4">Validation Checks</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Name Consistency</p>
                  <p className="text-xs text-gray-500">
                    Name matches across all documents
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Qualification Alignment</p>
                  <p className="text-xs text-gray-500">
                    Degree certificate matches entered qualification
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Graduation Year Validation</p>
                  <p className="text-xs text-gray-500">
                    Year matches with degree certificate
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                {hasIssues ? (
                  <>
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Marks / CGPA Comparison</p>
                      <p className="text-xs text-red-600">
                        Entered score (8.5) is higher than document score (7.8)
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Marks / CGPA Comparison</p>
                      <p className="text-xs text-gray-500">
                        Entered score is valid (within acceptable range)
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {hasIssues ? (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Validation Failed</AlertTitle>
              <AlertDescription className="text-red-700">
                Discrepancies detected in your documents. Your application has been flagged for review. Please contact the helpdesk or correct the information.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Validation Successful</AlertTitle>
              <AlertDescription className="text-green-700">
                All documents have been verified successfully. You may proceed to the next step.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between pt-4">
            <Button onClick={onBack} variant="outline">
              Back
            </Button>
            <Button onClick={onNext} className="px-8" disabled={hasIssues}>
              Next: Screening Test
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

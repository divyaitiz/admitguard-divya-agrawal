import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { CheckCircle, Clock, XCircle, FileText, Mail } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { useForm } from "../context/FormContext";
import { useState } from "react";

interface Step8Props {
  onBack: () => void;
}

export function Step8Admission({ onBack }: Step8Props) {
  const { formData, updateField } = useForm();
  const [offerSent, setOfferSent] = useState(false);
  const interviewStatus = formData.interviewStatus;

  const getStatusBadge = () => {
    switch (interviewStatus) {
      case "cleared":
        return (
          <Badge className="bg-green-100 text-green-800 text-base px-3 py-1">
            <CheckCircle className="w-4 h-4 mr-1" />
            Cleared
          </Badge>
        );
      case "waitlisted":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 text-base px-3 py-1">
            <Clock className="w-4 h-4 mr-1" />
            Waitlisted
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 text-base px-3 py-1">
            <XCircle className="w-4 h-4 mr-1" />
            Rejected
          </Badge>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Admission Decision & Offer Management</h2>

      <div className="space-y-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Interview Status</h3>
            {getStatusBadge()}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Candidate Name</p>
              <p className="font-medium">{formData.fullName || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{formData.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-500">Screening Score</p>
              <p className="font-medium">{formData.screeningScore}/100</p>
            </div>
            <div>
              <p className="text-gray-500">Interview Status</p>
              <p className="font-medium capitalize">{interviewStatus || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Label htmlFor="offerToggle" className="text-base font-medium">
                Send Offer Letter
              </Label>
              <p className="text-sm text-gray-500 mt-1">
                Enable to generate and send admission offer to the candidate
              </p>
            </div>
            <Switch
              id="offerToggle"
              checked={offerSent}
              onCheckedChange={setOfferSent}
            />
          </div>

          {offerSent && (
            <div className="mt-4 space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <FileText className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Offer Letter Status</AlertTitle>
                <AlertDescription className="text-blue-700">
                  {interviewStatus === "cleared" && "Offer letter will be sent immediately upon approval."}
                  {interviewStatus === "waitlisted" && "Conditional offer will be sent. Admission subject to seat availability."}
                  {interviewStatus === "rejected" && "Offer cannot be sent for rejected candidates."}
                </AlertDescription>
              </Alert>

              {interviewStatus !== "rejected" && (
                <>
                  <div>
                    <Label htmlFor="offerNotes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="offerNotes"
                      placeholder="Add any special conditions or notes for the offer letter..."
                      rows={3}
                      className="mt-1.5"
                      value={formData.admissionDetails}
                      onChange={(e) => updateField("admissionDetails", e.target.value)}
                    />
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Email Preview</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Offer letter will be sent to: {formData.email || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          CC: admissions@futurense.com
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {interviewStatus === "cleared" && offerSent && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Ready to Send Offer</AlertTitle>
            <AlertDescription className="text-green-700">
              All verification steps completed successfully. Click "Send Offer Letter" to finalize admission.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between pt-4">
          <Button onClick={onBack} variant="outline">
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">Save as Draft</Button>
            {interviewStatus === "cleared" && offerSent && (
              <Button className="px-8">
                <Mail className="w-4 h-4 mr-2" />
                Send Offer Letter
              </Button>
            )}
            {interviewStatus !== "cleared" && (
              <Button className="px-8">Complete Review</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

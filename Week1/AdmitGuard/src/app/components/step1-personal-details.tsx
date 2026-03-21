import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Calendar, AlertCircle } from "lucide-react";
import { useForm } from "../context/FormContext";
import { savePersonalDetails } from "../services/api";
import { Alert, AlertDescription } from "./ui/alert";

interface Step1Props {
  onNext: () => void;
}

export function Step1PersonalDetails({ onNext }: Step1Props) {
  const { formData, updateField, isLoading, error, setLoading, setError } = useForm();

  const handleNext = async () => {
    console.log('Step1 - Current formData:', formData);
    
    // Basic validation only
    if (!formData.fullName || !formData.email || !formData.phone || !formData.dob || !formData.aadhaar) {
      setError("Please fill in all fields");
      return;
    }

    // Check if applicationId exists
    if (!formData.applicationId) {
      console.log('Step1 - No applicationId found');
      setError("Application not initialized. Please refresh the page.");
      return;
    }

    console.log('Step1 - About to save with applicationId:', formData.applicationId);
    setLoading(true);
    try {
      await savePersonalDetails(formData.applicationId, formData);
      console.log('Step1 - Save successful');
      setError(null);
      onNext();
    } catch (err: any) {
      console.error('Personal details save error:', err);
      setError(err.message || "Failed to save personal details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Personal Details</h2>
      
      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}
      
      {formData.applicationId && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Application ID:</strong> {formData.applicationId}
          </p>
          <button
            onClick={() => {
              if (confirm('This will reset your entire application. Continue?')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="mt-2 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reset Application
          </button>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            className="mt-1.5"
            value={formData.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            As per government ID proof
          </p>
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            className="mt-1.5"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter 10-digit mobile number"
            maxLength={10}
            className="mt-1.5"
            value={formData.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">10 digits only</p>
        </div>

        <div>
          <Label htmlFor="dob">Date of Birth *</Label>
          <div className="relative mt-1.5">
            <Input
              id="dob"
              type="date"
              placeholder="DD/MM/YYYY"
              max={new Date().toISOString().split('T')[0]}
              className="mt-1.5"
              value={formData.dob}
              onChange={(e) => updateField("dob", e.target.value)}
              disabled={isLoading}
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Must be between 18-35 years old
          </p>
        </div>

        <div>
          <Label htmlFor="aadhaar">Aadhaar Number *</Label>
          <Input
            id="aadhaar"
            placeholder="Enter 12-digit Aadhaar number"
            maxLength={12}
            className="mt-1.5"
            value={formData.aadhaar}
            onChange={(e) => updateField("aadhaar", e.target.value)}
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            12 digits (without spaces)
          </p>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleNext} disabled={isLoading} className="px-8">
            {isLoading ? "Saving..." : "Next: ID Verification"}
          </Button>
        </div>
      </div>
    </div>
  );
}

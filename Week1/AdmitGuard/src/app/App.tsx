import { useState, useEffect } from "react";
import { FileCheck } from "lucide-react";
import { FormProvider, useForm } from "./context/FormContext";
import { StepIndicator } from "./components/step-indicator";
import { Step1PersonalDetails } from "./components/step1-personal-details";
import { Step2IdentityVerification } from "./components/step2-identity-verification";
import { Step3AcademicDetails } from "./components/step3-academic-details";
import { Step4DocumentUpload } from "./components/step4-document-upload";
import { Step5AIValidation } from "./components/step5-ai-validation";
import { Step6Screening } from "./components/step6-screening";
import { Step7Interview } from "./components/step7-interview";
import { Step8Admission } from "./components/step8-admission";
import { createApplication } from "./services/api";

const steps = [
  { number: 1, title: "Personal Details" },
  { number: 2, title: "ID Verification" },
  { number: 3, title: "Academic Details" },
  { number: 4, title: "Documents" },
  { number: 5, title: "AI Validation" },
  { number: 6, title: "Screening" },
  { number: 7, title: "Interview" },
  { number: 8, title: "Admission" },
];

function AppContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const { formData, setApplicationId, setError } = useForm();

  useEffect(() => {
    // Initialize application if not already created
    if (!formData.applicationId) {
      console.log('No applicationId found, initializing...');
      initializeApplication();
    }
  }, []);

  const initializeApplication = async () => {
    try {
      console.log('Initializing application...');
      // Use a temporary email for now, will be updated in Step 1
      const tempEmail = `user_${Date.now()}@example.com`;
      console.log('Creating application with email:', tempEmail);
      
      const response = await createApplication(tempEmail);
      console.log('Application created:', response);
      
      setApplicationId(response.applicationId);
      console.log('Application ID set:', response.applicationId);
    } catch (err: any) {
      console.error("Failed to initialize application:", err);
      setError("Failed to initialize application");
    }
  };

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <FileCheck className="w-10 h-10 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">
                Futurense Document Verification
              </h1>
            </div>
            <p className="text-gray-600">
              Streamlined candidate verification and admission process
            </p>
            {formData.applicationId && (
              <p className="text-xs text-gray-500 mt-2">
                Application ID: {formData.applicationId.slice(0, 8)}...
              </p>
            )}
          </div>

          {/* Step Indicator */}
          <StepIndicator
            currentStep={currentStep}
            totalSteps={8}
            steps={steps}
          />

          {/* Main Content Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 min-h-[600px]">
            {currentStep === 1 && <Step1PersonalDetails onNext={handleNext} />}
            {currentStep === 2 && (
              <Step2IdentityVerification onNext={handleNext} onBack={handleBack} />
            )}
            {currentStep === 3 && (
              <Step3AcademicDetails onNext={handleNext} onBack={handleBack} />
            )}
            {currentStep === 4 && (
              <Step4DocumentUpload onNext={handleNext} onBack={handleBack} />
            )}
            {currentStep === 5 && (
              <Step5AIValidation onNext={handleNext} onBack={handleBack} />
            )}
            {currentStep === 6 && (
              <Step6Screening onNext={handleNext} onBack={handleBack} />
            )}
            {currentStep === 7 && (
              <Step7Interview onNext={handleNext} onBack={handleBack} />
            )}
            {currentStep === 8 && <Step8Admission onBack={handleBack} />}
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-gray-500">
            <p>© 2026 Futurense Technologies. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <FormProvider>
      <AppContent />
    </FormProvider>
  );
}

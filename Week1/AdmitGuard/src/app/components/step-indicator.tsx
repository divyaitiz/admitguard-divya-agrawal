import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: { number: number; title: string }[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  step.number < currentStep
                    ? "bg-green-500 border-green-500 text-white"
                    : step.number === currentStep
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {step.number < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <div className="text-xs mt-2 text-center max-w-[100px]">
                <div
                  className={
                    step.number === currentStep
                      ? "font-semibold text-gray-900"
                      : "text-gray-500"
                  }
                >
                  {step.title}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 ${
                  step.number < currentStep ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

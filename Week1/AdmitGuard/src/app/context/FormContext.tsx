import React, { createContext, useContext, useState, ReactNode } from "react";

export interface FormData {
  applicationId: string;
  
  // Step 1: Personal Details
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  aadhaar: string;

  // Step 2: Identity Verification
  identityDocument: File | null;
  identityDocumentName: string;

  // Step 3: Academic Details
  qualification: string;
  gradYear: string;
  institution: string;
  cgpa: string;
  course: string;

  // Step 4: Document Upload
  documents: File[];
  documentNames: string[];

  // Step 5: AI Validation
  aiValidationStatus: string;
  aiValidationDetails: string;

  // Step 6: Screening
  screeningScore: string;
  screeningFeedback: string;
  screeningStatus: string;

  // Step 7: Interview
  interviewDate: string;
  interviewTime: string;
  interviewLocation: string;
  interviewStatus: string;

  // Step 8: Admission
  admissionStatus: string;
  admissionDetails: string;
}

const initialFormData: FormData = {
  applicationId: "",
  fullName: "",
  email: "",
  phone: "",
  dob: "",
  aadhaar: "",
  identityDocument: null,
  identityDocumentName: "",
  qualification: "",
  gradYear: "",
  institution: "",
  cgpa: "",
  course: "",
  documents: [],
  documentNames: [],
  aiValidationStatus: "",
  aiValidationDetails: "",
  screeningScore: "",
  screeningFeedback: "",
  screeningStatus: "",
  interviewDate: "",
  interviewTime: "",
  interviewLocation: "",
  interviewStatus: "",
  admissionStatus: "",
  admissionDetails: "",
};

interface FormContextType {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  updateField: (field: keyof FormData, value: any) => void;
  resetForm: () => void;
  getStepData: (step: number) => Partial<FormData>;
  setApplicationId: (id: string) => void;
  isLoading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setError(null);
  };

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const setApplicationId = (id: string) => {
    setFormData((prev) => ({ ...prev, applicationId: id }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setError(null);
  };

  const getStepData = (step: number): Partial<FormData> => {
    switch (step) {
      case 1:
        return {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          dob: formData.dob,
          aadhaar: formData.aadhaar,
        };
      case 2:
        return {
          identityDocument: formData.identityDocument,
          identityDocumentName: formData.identityDocumentName,
        };
      case 3:
        return {
          qualification: formData.qualification,
          gradYear: formData.gradYear,
          institution: formData.institution,
          cgpa: formData.cgpa,
          course: formData.course,
        };
      case 4:
        return {
          documents: formData.documents,
          documentNames: formData.documentNames,
        };
      case 5:
        return {
          aiValidationStatus: formData.aiValidationStatus,
          aiValidationDetails: formData.aiValidationDetails,
        };
      case 6:
        return {
          screeningScore: formData.screeningScore,
          screeningFeedback: formData.screeningFeedback,
          screeningStatus: formData.screeningStatus,
        };
      case 7:
        return {
          interviewDate: formData.interviewDate,
          interviewTime: formData.interviewTime,
          interviewLocation: formData.interviewLocation,
          interviewStatus: formData.interviewStatus,
        };
      case 8:
        return {
          admissionStatus: formData.admissionStatus,
          admissionDetails: formData.admissionDetails,
        };
      default:
        return {};
    }
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        updateFormData,
        updateField,
        resetForm,
        getStepData,
        setApplicationId,
        isLoading,
        error,
        setLoading: setIsLoading,
        setError,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useForm(): FormContextType {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
}

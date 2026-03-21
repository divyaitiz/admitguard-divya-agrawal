// Use relative paths so Nginx can proxy them in Docker
// For dev: http://localhost:5000/api (via vite proxy or direct)
// For Docker: Nginx proxies /api to backend:5000/api
const API_URL = (import.meta as any).env?.VITE_API_URL || '/api';

// Create new application
export const createApplication = async (email: string) => {
  const response = await fetch(`${API_URL}/applications/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  
  if (!response.ok) throw new Error('Failed to create application');
  return response.json();
};

// Get application details
export const getApplication = async (applicationId: string) => {
  const response = await fetch(`${API_URL}/applications/${applicationId}`);
  
  if (!response.ok) throw new Error('Failed to fetch application');
  return response.json();
};

// Step 1: Save personal details
export const savePersonalDetails = async (applicationId: string, data: any) => {
  try {
    const response = await fetch(`${API_URL}/applications/${applicationId}/step1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        dob: data.dob,
        aadhaar: data.aadhaar,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
      
      // Return specific error message from backend if available
      if (errorData.error) {
        throw new Error(errorData.error);
      }
      if (errorData.errors && errorData.errors.length > 0) {
        throw new Error(errorData.errors.join(', '));
      }
      
      throw new Error(`Failed to save personal details (${response.status})`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Save personal details error:', error);
    throw error;
  }
};

// Step 2: Upload identity document
export const uploadIdentityDocument = async (applicationId: string, file: File) => {
  const formData = new FormData();
  formData.append('document', file);

  const response = await fetch(`${API_URL}/applications/${applicationId}/step2`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Failed to upload identity document');
  return response.json();
};

// Step 3: Save academic details
export const saveAcademicDetails = async (applicationId: string, data: any) => {
  const response = await fetch(`${API_URL}/applications/${applicationId}/step3`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      qualification: data.qualification,
      gradYear: data.gradYear,
      cgpa: data.cgpa,
      institution: data.institution,
    }),
  });

  if (!response.ok) throw new Error('Failed to save academic details');
  return response.json();
};

// Step 4: Upload academic documents
export const uploadAcademicDocuments = async (applicationId: string, files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('documents', file));

  const response = await fetch(`${API_URL}/applications/${applicationId}/step4`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Failed to upload documents');
  return response.json();
};

// Step 5: AI Validation
export const validateDocumentsAI = async (applicationId: string) => {
  const response = await fetch(`${API_URL}/applications/${applicationId}/step5`, {
    method: 'POST',
  });

  if (!response.ok) throw new Error('Failed to validate documents');
  return response.json();
};

// Step 6: Save screening score
export const saveScreeningScore = async (applicationId: string, data: any) => {
  const response = await fetch(`${API_URL}/applications/${applicationId}/step6`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      screeningScore: data.screeningScore,
      screeningFeedback: data.screeningFeedback,
    }),
  });

  if (!response.ok) throw new Error('Failed to save screening score');
  return response.json();
};

// Step 7: Save interview decision
export const saveInterviewDecision = async (applicationId: string, data: any) => {
  const response = await fetch(`${API_URL}/applications/${applicationId}/step7`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      interviewStatus: data.interviewStatus,
      interviewFeedback: data.interviewFeedback,
    }),
  });

  if (!response.ok) throw new Error('Failed to save interview decision');
  return response.json();
};

// Step 8: Send offer letter
export const sendOfferLetter = async (applicationId: string, data: any) => {
  const response = await fetch(`${API_URL}/applications/${applicationId}/step8`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      admissionDetails: data.admissionDetails,
    }),
  });

  if (!response.ok) throw new Error('Failed to send offer letter');
  return response.json();
};

// Admin: Get all applications
export const getAllApplications = async () => {
  const response = await fetch(`${API_URL}/applications`);
  
  if (!response.ok) throw new Error('Failed to fetch applications');
  return response.json();
};

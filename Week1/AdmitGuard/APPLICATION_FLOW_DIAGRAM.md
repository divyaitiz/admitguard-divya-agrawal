# AdmitGuard Application Flow Diagram

## 🏗️ **Overall Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   PostgreSQL    │
│   (React)       │◄──►│   (Node.js)     │◄──►│   Database      │
│   Port: 5173    │    │   Port: 5000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 **Complete 8-Step Application Flow**

### **Step 0: Application Initialization**
```
Frontend (App.tsx)
├── useEffect() triggers on page load
├── Checks if applicationId exists in FormContext
├── If none → calls POST /api/applications/create
├── Backend generates UUID and creates DB record
├── Frontend stores applicationId in FormContext
└── User sees Step 1: Personal Details
```

### **Step 1: Personal Details**
```
User fills form → Frontend validation → API call → Backend validation → Database update

Frontend (step1-personal-details.tsx)
├── User enters: fullName, email, phone, dob, aadhaar
├── Click "Next" → handleNext() triggers
├── Basic validation: all fields required
├── POST /api/applications/{id}/step1 with form data
│
├── Backend (applicationController.js)
│   ├── UUID validation
│   ├── Field validation:
│   │   ├── fullName: 2+ chars, letters only
│   │   ├── email: valid format
│   │   ├── phone: 10-digit, 6/7/8/9 prefix
│   │   ├── aadhaar: 12 digits
│   │   └── dob: age 18-35 (2024-08-01 program date)
│   └── UPDATE applications SET current_step = 2
│
└── Success → Frontend advances to Step 2
```

### **Step 2: Identity Verification**
```
Frontend (step2-identity-verification.tsx)
├── User uploads ID document
├── POST /api/applications/{id}/step2 with file
│
├── Backend
│   ├── File validation and storage
│   ├── UPDATE applications SET identity_document_url
│   └── SET current_step = 3
│
└── Success → Frontend advances to Step 3
```

### **Step 3: Academic Details**
```
Frontend (step3-academic-details.tsx)
├── User enters: qualification, gradYear, cgpa, institution
├── POST /api/applications/{id}/step3
│
├── Backend validation:
│   ├── qualification: B.Tech, B.E., B.Sc, BCA, M.Tech, M.Sc, MCA, MBA
│   ├── gradYear: 2015-2025 (soft rule)
│   └── cgpa: min 60% or 6.0 CGPA (soft rule)
│   └── UPDATE applications SET current_step = 4
│
└── Success → Frontend advances to Step 4
```

### **Step 4: Document Upload**
```
Frontend (step4-document-upload.tsx)
├── User uploads academic documents
├── POST /api/applications/{id}/step4 with files
│
├── Backend
│   ├── File storage
│   ├── UPDATE applications SET documents JSON
│   └── SET current_step = 5
│
└── Success → Frontend advances to Step 5
```

### **Step 5: AI Validation**
```
Frontend (step5-ai-validation.tsx)
├── Click "Validate Documents"
├── POST /api/applications/{id}/step5
│
├── Backend (placeholder AI service)
│   ├── Simulated validation checks
│   ├── UPDATE applications SET ai_validation_status = 'passed'
│   └── SET current_step = 6
│
└── Success → Frontend advances to Step 6
```

### **Step 6: Screening Test**
```
Frontend (step6-screening.tsx)
├── User enters screening score
├── POST /api/applications/{id}/step6
│
├── Backend validation:
│   ├── screeningScore: must be ≥ 40 (soft rule)
│   ├── status = 'qualified' if ≥ 40 else 'disqualified'
│   └── UPDATE applications SET screening_status
│   └── SET current_step = 7 (if qualified) or 8 (if disqualified)
│
└── Success → Frontend advances to Step 7
```

### **Step 7: Interview Decision**
```
Frontend (step7-interview.tsx)
├── Admin selects interview status
├── POST /api/applications/{id}/step7
│
├── Backend validation:
│   ├── interviewStatus: Cleared, Waitlisted, Rejected
│   ├── IF Rejected → blocks offer letter
│   └── UPDATE applications SET interview_status
│   └── SET current_step = 8
│
└── Success → Frontend advances to Step 8
```

### **Step 8: Offer Letter**
```
Frontend (step8-admission.tsx)
├── Admin clicks "Send Offer Letter"
├── POST /api/applications/{id}/step8
│
├── Backend business rules:
│   ├── Check interview_status must be Cleared or Waitlisted
│   ├── IF Rejected → error: "Cannot send offer to rejected candidates"
│   ├── UPDATE applications SET offer_letter_sent = true
│   └── SET admission_status = 'admitted'
│
└── Success → Application complete!
```

## 🔍 **Validation Rules Flow**

### **Strict Rules (No Exceptions Allowed)**
```
┌─────────────────┬──────────────────────────┬─────────────────┐
│     Field       │        Validation         │   Action        │
├─────────────────┼──────────────────────────┼─────────────────┤
│ fullName        │ 2+ chars, letters only   │ Block submission│
│ email           │ Valid format             │ Block submission│
│ phone           │ 10-digit, 6/7/8/9 prefix │ Block submission│
│ qualification    │ Approved list only       │ Block submission│
│ interviewStatus │ Cleared/Waitlisted/Rejected│ Block submission│
│ aadhaar         │ 12 digits                │ Block submission│
└─────────────────┴──────────────────────────┴─────────────────┘
```

### **Soft Rules (Exceptions Allowed)**
```
┌─────────────────┬──────────────────────────┬─────────────────┐
│     Field       │        Validation         │   Action        │
├─────────────────┼──────────────────────────┼─────────────────┤
│ dob             │ Age 18-35 on 2024-08-01   │ Can request    │
│ gradYear        │ 2015-2025                 │ exception       │
│ cgpa/percentage │ Min 60% or 6.0 CGPA       │                │
│ screeningScore  │ Minimum 40/100            │                │
└─────────────────┴──────────────────────────┴─────────────────┘
```

### **System Rules**
```
┌─────────────────┬──────────────────────────┬─────────────────┐
│     Rule        │        Condition         │   Action        │
├─────────────────┼──────────────────────────┼─────────────────┤
│ Max Exceptions  │ > 2 soft rule exceptions │ Manager review │
│ Offer Letter    │ Interview must be        │ Block if       │
│                 │ Cleared or Waitlisted     │ Rejected       │
└─────────────────┴──────────────────────────┴─────────────────┘
```

## 🔄 **Exception Handling Flow**

```
Soft Rule Violation Detected
        │
        ▼
┌─────────────────┐
│ Frontend shows   │
│ "Can request     │
│ exception"       │
└─────────────────┘
        │
        ▼
User clicks "Request Exception"
        │
        ▼
POST /api/exceptions/applications/{id}/exceptions
        │
        ▼
┌─────────────────┐
│ Backend creates │
│ exception record│
│ status = 'pending'│
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ Manager reviews │
│ via admin panel │
└─────────────────┘
        │
        ▼
PUT /api/exceptions/exceptions/{id}/review
        │
        ▼
┌─────────────────┐
│ Status =        │
│ 'approved' or   │
│ 'rejected'      │
└─────────────────┘
        │
        ▼
If approved → Application continues
If rejected → User must fix the issue
```

## 🗄️ **Database Schema Flow**

```
applications table
├── id (UUID, Primary Key)
├── current_step (1-8)
├── personal_details (fullName, email, phone, dob, aadhaar)
├── academic_details (qualification, gradYear, cgpa, institution)
├── documents (identity_document_url, documents JSON)
├── validation (ai_validation_status, screening_score)
├── interview (interview_status, interview_feedback)
├── admission (offer_letter_sent, admission_status)
├── exceptions_approved (counter)
└── timestamps (created_at, updated_at, submitted_at)

exceptions table
├── id (UUID, Primary Key)
├── application_id (Foreign Key)
├── field (which rule violated)
├── rationale (why exception needed)
├── status (pending/approved/rejected)
├── manager_feedback
└── timestamps
```

## 🚨 **Error Handling Flow**

```
Frontend Error
        │
        ▼
┌─────────────────┐
│ API Call Fails  │
│ (response.ok = false)│
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ Parse error     │
│ response.json() │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ Show specific   │
│ error message   │
│ in red alert    │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ User fixes      │
│ issue & retries │
└─────────────────┘
```

## 📊 **State Management Flow**

```
FormContext (Global State)
├── formData (all form fields)
├── applicationId (UUID)
├── currentStep (1-8)
├── isLoading (boolean)
└── error (string | null)

Component Updates
├── User types → updateField() → formData changes
├── Form submit → API call → Backend validation
├── Success → updateFormData() → Step advances
└── Error → setError() → Error message shows
```

## 🎯 **Current Implementation Status**

```
✅ COMPLETED:
├── Step 0: Application initialization
├── Step 1: Personal details with validation
├── Step 2: Identity document upload
├── Step 3: Academic details with validation
├── Step 4: Document upload
├── Step 5: AI validation (placeholder)
├── Step 6: Screening test with cutoff
├── Step 7: Interview decision
├── Step 8: Offer letter with business rules
├── All validation rules (strict + soft)
├── Exception handling system
├── Database schema
└── Error handling

🔧 DEBUGGING:
├── Console logging in all steps
├── Application ID display
├── Reset functionality
├── Detailed error messages
└── UUID validation
```

This diagram shows the complete flow from user interaction through frontend, backend, database, and all validation rules. The system is designed to be robust with comprehensive validation at each step.

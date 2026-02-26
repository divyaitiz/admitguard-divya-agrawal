# Problem Statement – 

Futurense is experiencing inefficiency due to bottlenecks created at the document verification stage for past 3 months.

They want to optimize this step so that a candidate’s document verification takes minimal expenditure of time & resources.

---

# Proposed Approach – 

# 📄 Candidate Admission & Document Verification Workflow

---

## 🧩 Workflow Stages

### Step 1: Personal Details Capture
Collect core identity information:
- Full Name  
- Email  
- Phone (10 digits validation)  
- Date of Birth  
- Aadhaar Number (12 digits validation)  

---

### Step 2: Personal Identity Verification
- Upload Government ID proof (Aadhaar / other ID)  
- Perform validation:
  - Match: Name, DOB, ID number  

**Decision Logic:**
- If mismatch → Flag + redirect to helpdesk OR disqualify  
- If match → Proceed  

---

### Step 3: Academic Details Capture
- Highest Qualification (Dropdown):
  - B.Tech, B.E., B.Sc, BCA, M.Tech, M.Sc, MCA, MBA  
- Graduation Year (Range: 2015–2025)  
- Percentage / CGPA (toggle-based input)  

---

### Step 4: Academic Document Upload
- Upload supporting documents:
  - Degree Certificate  
  - Marksheets:
    - Secondary Education  
    - Higher Secondary Education  
    - Undergraduate  

- Ensure each entered field has a corresponding document  

---

### Step 5: AI-Based Integrity Validation
- Cross-check:
  - Name consistency across documents  
  - Qualification alignment  
  - Graduation year validation  
  - Marks / CGPA comparison  

**Exception Handling:**
- If entered score ≤ actual score → Acceptable  
- If entered score > actual score → Disqualify  

---

### Step 6: Screening Evaluation
- Screening Test Score (0–100)  

**Optional Logic:**
- Define cutoff (e.g., 60):
  - Below cutoff → Reject  
  - Above cutoff → Proceed to interview  

---

### Step 7: Interview Decision
- Interview Status:
  - Cleared  
  - Waitlisted  
  - Rejected  

---

### Step 8: Admission Decision & Offer Management
- Offer Letter Sent (Yes/No toggle)  

**Decision Flow:**
- If Interview = Cleared → Offer = Yes  
- If Waitlisted → Offer = Conditional / Delayed  
- If Rejected → Offer = No  

---

## ✅ Summary Flow
1. Capture personal details  
2. Verify identity  
3. Collect academic data  
4. Upload documents  
5. Validate via AI  
6. Conduct screening  
7. Interview decision  
8. Final offer rollout  

---

# 🛠️ Suggested Tech Stack

- Frontend: React (TypeScript) for a type-safe, maintainable codebase.  
- Styling: Tailwind CSS using a "Minimal Utility" design recipe (Recipe 8). Think high-contrast typography, generous whitespace, and subtle borders.  
- AI Engine: Gemini 3.1 Pro for the document verification. It excels at OCR (Optical Character Recognition) and reasoning, allowing it to compare text from images against form data while understanding the "under-reported marks" exception.  
- Animations: Motion (framer-motion) for smooth, professional transitions between steps.  
- Icons: Lucide-react for sharp, consistent iconography.  
- State Management: React Hooks (useState/useReducer) to manage the multi-step form state.  

# Problem Statement – 

Futurense is experiencing inefficiency due to bottlenecks created at the document verification stage for past 3 months.

They want to optimize this step so that a candidate’s document verification takes minimal expenditure of time & resources.

---

# Proposed Approach – 

The document verification process can briefly be divided into 5 different steps:

## 1) Personal Details – 
Name, DOB, email, phone, Govt id card number.

## 2) Validation of personal details – 
Goverenment ID card attachment upload.

- If the personal details do not match with govt. id proof prompt user to reach the helpdesk or disqualify.

## 3) Academic Details – 
- Highest Qualification (dropdown: B.Tech, B.E., B.Sc, BCA, M.Tech, M.Sc, MCA, MBA)  
- Graduation Year (number, range 2015-2025)  
- Percentage or CGPA (number with a toggle to switch between percentage and CGPA mode)

## 4) Educational document Upload – 
all details asked for in step 3 should have their respective document uploaded.

## 5) AI Validation (Integrity Check) – 
cross check whether the inputs made by the user matches the data he has provided. If not, we disqualify the candidate at that point only.

a. There can be an exception case with this with the marks entered earlier by the user is less than the ones in the marksheet, So that can be considered.

If the entered details of the user matches the ones in the images/attachments he provided, then we move ahead.

---

# 🛠️ Suggested Tech Stack

- Frontend: React (TypeScript) for a type-safe, maintainable codebase.  
- Styling: Tailwind CSS using a "Minimal Utility" design recipe (Recipe 8). Think high-contrast typography, generous whitespace, and subtle borders.  
- AI Engine: Gemini 3.1 Pro for the document verification. It excels at OCR (Optical Character Recognition) and reasoning, allowing it to compare text from images against form data while understanding the "under-reported marks" exception.  
- Animations: Motion (framer-motion) for smooth, professional transitions between steps.  
- Icons: Lucide-react for sharp, consistent iconography.  
- State Management: React Hooks (useState/useReducer) to manage the multi-step form state.  

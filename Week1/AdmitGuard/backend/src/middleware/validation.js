// Eligibility Validation Rules
export const VALIDATION_RULES = {
  // Strict Rules (No exceptions allowed)
  strict: {
    fullName: {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z\s]+$/,
      message: "Full name must be 2-100 characters, letters only, no numbers"
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Valid email format required"
    },
    phone: {
      required: true,
      pattern: /^[6789]\d{9}$/,
      message: "10-digit Indian mobile number starting with 6,7,8, or 9"
    },
    qualification: {
      required: true,
      allowed: ["B.Tech", "B.E.", "B.Sc", "BCA", "M.Tech", "M.Sc", "MCA", "MBA"],
      message: "Must be one of: B.Tech, B.E., B.Sc, BCA, M.Tech, M.Sc, MCA, MBA"
    },
    interviewStatus: {
      required: true,
      allowed: ["Cleared", "Waitlisted", "Rejected"],
      message: "Must be: Cleared, Waitlisted, or Rejected"
    },
    aadhaar: {
      required: true,
      pattern: /^\d{12}$/,
      message: "Exactly 12 digits, no alphabets"
    }
  },

  // Soft Rules (Exceptions allowed with rationale)
  soft: {
    dob: {
      required: true,
      minAge: 18,
      maxAge: 35,
      programStartDate: new Date("2024-08-01"), // Updated to current realistic date
      message: "Age must be between 18-35 years on program start date"
    },
    gradYear: {
      required: true,
      min: 2015,
      max: 2025,
      message: "Graduation year must be between 2015-2025"
    },
    cgpa: {
      required: true,
      minPercentage: 60,
      minCGPA: 6.0,
      maxCGPA: 10.0,
      message: "Minimum 60% or 6.0 CGPA (on 10-point scale)"
    },
    screeningScore: {
      required: true,
      min: 0,
      max: 100,
      cutoff: 40,
      message: "Screening test score must be ≥ 40 out of 100"
    }
  },

  // System Rules (Automatic)
  system: {
    maxExceptions: 2,
    offerLetterRule: "Offer letter can only be sent if Interview Status = 'Cleared' or 'Waitlisted'"
  }
};

// Validation Functions
export const validateField = (fieldName, value, fieldType = 'strict') => {
  const rules = VALIDATION_RULES[fieldType]?.[fieldName];
  if (!rules) return { valid: true };

  const errors = [];

  // Required validation
  if (rules.required && (!value || value.toString().trim() === '')) {
    errors.push(`${fieldName} is required`);
    return { valid: false, errors };
  }

  // Skip other validations if field is empty and not required
  if (!value || value.toString().trim() === '') {
    return { valid: true };
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value.toString())) {
    errors.push(rules.message);
  }

  // Length validation
  if (rules.minLength && value.toString().length < rules.minLength) {
    errors.push(`Minimum ${rules.minLength} characters required`);
  }

  if (rules.maxLength && value.toString().length > rules.maxLength) {
    errors.push(`Maximum ${rules.maxLength} characters allowed`);
  }

  // Allowed values validation
  if (rules.allowed && !rules.allowed.includes(value)) {
    errors.push(rules.message);
  }

  // Numeric validation
  if (rules.min !== undefined && parseFloat(value) < rules.min) {
    errors.push(`Minimum value is ${rules.min}`);
  }

  if (rules.max !== undefined && parseFloat(value) > rules.max) {
    errors.push(`Maximum value is ${rules.max}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Date validation for DOB
export const validateAge = (dob, programStartDate) => {
  const birthDate = new Date(dob);
  const programDate = programStartDate || VALIDATION_RULES.soft.dob.programStartDate;
  
  // Calculate age more precisely
  let age = programDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = programDate.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && programDate.getDate() < birthDate.getDate())) {
    age--;
  }
  
  console.log('Age validation:', {
    dob,
    birthDate,
    programDate,
    calculatedAge: age,
    minAge: VALIDATION_RULES.soft.dob.minAge,
    maxAge: VALIDATION_RULES.soft.dob.maxAge
  });

  return {
    valid: age >= VALIDATION_RULES.soft.dob.minAge && age <= VALIDATION_RULES.soft.dob.maxAge,
    age,
    errors: age < VALIDATION_RULES.soft.dob.minAge 
      ? [`Must be at least ${VALIDATION_RULES.soft.dob.minAge} years old (you are ${age})`]
      : age > VALIDATION_RULES.soft.dob.maxAge 
        ? [`Must be no older than ${VALIDATION_RULES.soft.dob.maxAge} years old (you are ${age})`]
        : []
  };
};

// CGPA/Percentage validation
export const validateScore = (score, isCGPA = false) => {
  const numericScore = parseFloat(score);
  const rules = VALIDATION_RULES.soft.cgpa;
  
  if (isCGPA) {
    return {
      valid: numericScore >= rules.minCGPA && numericScore <= rules.maxCGPA,
      errors: numericScore < rules.minCGPA 
        ? [`Minimum CGPA is ${rules.minCGPA}`]
        : numericScore > rules.maxCGPA 
          ? [`Maximum CGPA is ${rules.maxCGPA}`]
          : []
    };
  } else {
    return {
      valid: numericScore >= rules.minPercentage && numericScore <= 100,
      errors: numericScore < rules.minPercentage 
        ? [`Minimum percentage is ${rules.minPercentage}%`]
        : numericScore > 100 
          ? ['Maximum percentage is 100%']
          : []
    };
  }
};

// Complete application validation
export const validateApplication = (applicationData) => {
  const results = {
    valid: true,
    strictErrors: [],
    softErrors: [],
    exceptions: [],
    requiresManagerReview: false
  };

  // Validate strict rules
  Object.keys(VALIDATION_RULES.strict).forEach(field => {
    const validation = validateField(field, applicationData[field], 'strict');
    if (!validation.valid) {
      results.strictErrors.push({
        field,
        errors: validation.errors
      });
      results.valid = false;
    }
  });

  // Validate soft rules
  Object.keys(VALIDATION_RULES.soft).forEach(field => {
    let validation;
    
    if (field === 'dob') {
      validation = validateAge(applicationData[field]);
    } else if (field === 'cgpa') {
      const isCGPA = applicationData.scoreType === 'cgpa';
      validation = validateScore(applicationData[field], isCGPA);
    } else {
      validation = validateField(field, applicationData[field], 'soft');
    }

    if (!validation.valid) {
      results.softErrors.push({
        field,
        errors: validation.errors,
        canException: true
      });
    }
  });

  // Check if too many exceptions
  if (results.softErrors.length > VALIDATION_RULES.system.maxExceptions) {
    results.requiresManagerReview = true;
    results.valid = false;
  }

  // Business rule validation
  if (applicationData.interviewStatus === 'Rejected') {
    results.strictErrors.push({
      field: 'interviewStatus',
      errors: ['Rejected candidates cannot proceed to offer letter stage']
    });
    results.valid = false;
  }

  if (applicationData.offerLetterSent && 
      !['Cleared', 'Waitlisted'].includes(applicationData.interviewStatus)) {
    results.strictErrors.push({
      field: 'offerLetterSent',
      errors: [VALIDATION_RULES.system.offerLetterRule]
    });
    results.valid = false;
  }

  return results;
};

export default {
  VALIDATION_RULES,
  validateField,
  validateAge,
  validateScore,
  validateApplication
};

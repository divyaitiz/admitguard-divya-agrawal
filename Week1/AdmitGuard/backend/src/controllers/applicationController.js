import pool from '../config/database.js';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import path from 'path';
import { validateApplication, validateField, validateAge } from '../middleware/validation.js';

// Create new application
export const createApplication = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if application already exists for this email
    const existing = await pool.query(
      'SELECT id FROM applications WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        error: 'Application already exists for this email',
        applicationId: existing.rows[0].id,
      });
    }

    const applicationId = uuid();
    const result = await pool.query(
      `INSERT INTO applications (id, email, current_step) 
       VALUES ($1, $2, 1) 
       RETURNING *`,
      [applicationId, email]
    );

    res.status(201).json({
      message: 'Application created',
      applicationId: result.rows[0].id,
    });
  } catch (err) {
    console.error('Error creating application:', err);
    res.status(500).json({ error: 'Failed to create application' });
  }
};

// Get application by ID
export const getApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM applications WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching application:', err);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
};

// Step 1: Save Personal Details
export const savePersonalDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        error: 'Invalid application ID format',
        message: 'Please refresh the page and try again'
      });
    }
    
    const { fullName, email, phone, dob, aadhaar } = req.body;

    // Validation - only validate personal details fields
    const personalData = { fullName, email, phone, dob, aadhaar };
    
    // Manual validation for personal details only
    const errors = [];
    
    // Full name validation
    if (!fullName || fullName.trim() === '') {
      errors.push('Full name is required');
    } else if (fullName.length < 2) {
      errors.push('Full name must be at least 2 characters');
    } else if (!/^[a-zA-Z\s]+$/.test(fullName)) {
      errors.push('Full name must contain only letters');
    }
    
    // Email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Valid email is required');
    }
    
    // Phone validation
    if (!phone || !/^[6789]\d{9}$/.test(phone)) {
      errors.push('10-digit Indian mobile number starting with 6,7,8, or 9 is required');
    }
    
    // Aadhaar validation
    if (!aadhaar || !/^\d{12}$/.test(aadhaar)) {
      errors.push('12-digit Aadhaar number is required');
    }
    
    // DOB validation
    if (!dob) {
      errors.push('Date of birth is required');
    } else {
      const ageValidation = validateAge(dob);
      if (!ageValidation.valid) {
        errors.push(`Age validation failed: ${ageValidation.errors.join(', ')}`);
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        errors,
        message: 'Please correct the following errors before proceeding'
      });
    }

    const result = await pool.query(
      `UPDATE applications 
       SET full_name = $1, email = $2, phone = $3, dob = $4, aadhaar = $5, current_step = 2
       WHERE id = $6
       RETURNING *`,
      [fullName, email, phone, dob, aadhaar, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ 
      message: 'Personal details saved', 
      data: result.rows[0],
      validation: {
        passed: true
      }
    });
  } catch (err) {
    console.error('Error saving personal details:', err);
    
    // Handle UUID errors specifically
    if (err.code === '22P02' || err.routine === 'string_to_uuid') {
      return res.status(400).json({
        error: 'Invalid application ID',
        message: 'Application ID format is invalid. Please refresh the page.'
      });
    }
    
    res.status(500).json({ error: 'Failed to save personal details' });
  }
};

// Step 2: Upload and validate identity document
export const uploadIdentityDocument = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.files || !req.files.document) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files.document;
    const fileName = `identity_${id}_${Date.now()}${path.extname(file.name)}`;
    const uploadPath = `./uploads/${fileName}`;

    // Save file
    await file.mv(uploadPath);

    // Save document URL in database
    const result = await pool.query(
      `UPDATE applications 
       SET identity_document_url = $1, identity_validation_status = 'pending', current_step = 3
       WHERE id = $2
       RETURNING *`,
      [fileName, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ message: 'Identity document uploaded', data: result.rows[0] });
  } catch (err) {
    console.error('Error uploading document:', err);
    res.status(500).json({ error: 'Failed to upload document' });
  }
};

// Step 3: Save Academic Details
export const saveAcademicDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { qualification, gradYear, cgpa, institution, scoreType = 'percentage' } = req.body;

    // Validation
    const academicData = { qualification, gradYear, cgpa, scoreType };
    
    // Check qualification
    const qualValidation = validateField('qualification', qualification, 'strict');
    if (!qualValidation.valid) {
      return res.status(400).json({
        error: 'Qualification validation failed',
        errors: qualValidation.errors
      });
    }

    // Check graduation year
    const yearValidation = validateField('gradYear', gradYear, 'soft');
    if (!yearValidation.valid) {
      return res.status(400).json({
        error: 'Graduation year validation failed',
        errors: yearValidation.errors,
        canRequestException: true
      });
    }

    // Check CGPA/Percentage
    const scoreValidation = validateField('cgpa', cgpa, 'soft');
    if (!scoreValidation.valid) {
      return res.status(400).json({
        error: 'Score validation failed',
        errors: scoreValidation.errors,
        canRequestException: true
      });
    }

    const result = await pool.query(
      `UPDATE applications 
       SET qualification = $1, grad_year = $2, cgpa = $3, institution = $4, current_step = 4
       WHERE id = $5
       RETURNING *`,
      [qualification, gradYear, cgpa, institution, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ 
      message: 'Academic details saved', 
      data: result.rows[0],
      validation: {
        passed: true
      }
    });
  } catch (err) {
    console.error('Error saving academic details:', err);
    res.status(500).json({ error: 'Failed to save academic details' });
  }
};

// Step 4: Upload academic documents
export const uploadAcademicDocuments = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.files) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const documents = [];
    const files = Array.isArray(req.files.documents) 
      ? req.files.documents 
      : [req.files.documents];

    for (const file of files) {
      const fileName = `doc_${id}_${Date.now()}_${file.name}`;
      const uploadPath = `./uploads/${fileName}`;
      await file.mv(uploadPath);
      documents.push({
        originalName: file.name,
        storedName: fileName,
        uploadedAt: new Date().toISOString(),
      });
    }

    const result = await pool.query(
      `UPDATE applications 
       SET documents = $1, current_step = 5
       WHERE id = $2
       RETURNING *`,
      [JSON.stringify(documents), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ message: 'Documents uploaded', data: result.rows[0] });
  } catch (err) {
    console.error('Error uploading documents:', err);
    res.status(500).json({ error: 'Failed to upload documents' });
  }
};

// Step 5: AI Validation (placeholder for now)
export const validateDocumentsAI = async (req, res) => {
  try {
    const { id } = req.params;

    // For now, auto-pass validation. In production, call actual AI service
    const validationDetails = {
      nameConsistency: true,
      qualificationAlignment: true,
      graduationYearMatch: true,
      marksComparison: true,
      timestamp: new Date().toISOString(),
    };

    const result = await pool.query(
      `UPDATE applications 
       SET ai_validation_status = 'passed', 
           ai_validation_details = $1,
           ai_validation_date = CURRENT_TIMESTAMP,
           current_step = 6
       WHERE id = $2
       RETURNING *`,
      [JSON.stringify(validationDetails), id]
    );

    res.json({ message: 'AI validation completed', data: result.rows[0] });
  } catch (err) {
    console.error('Error in AI validation:', err);
    res.status(500).json({ error: 'Validation failed' });
  }
};

// Step 6: Save Screening Score
export const saveScreeningScore = async (req, res) => {
  try {
    const { id } = req.params;
    const { screeningScore, screeningFeedback } = req.body;

    // Validation - check cutoff of 40
    const scoreValidation = validateField('screeningScore', screeningScore, 'soft');
    if (!scoreValidation.valid) {
      return res.status(400).json({
        error: 'Screening score validation failed',
        errors: scoreValidation.errors,
        canRequestException: true,
        cutoff: 40
      });
    }

    const cutoff = 40; // Updated from 60 to 40 as per rules
    const status = screeningScore >= cutoff ? 'qualified' : 'disqualified';

    const result = await pool.query(
      `UPDATE applications 
       SET screening_score = $1, 
           screening_feedback = $2,
           screening_status = $3,
           current_step = $4
       WHERE id = $5
       RETURNING *`,
      [screeningScore, screeningFeedback, status, status === 'qualified' ? 7 : 8, id]
    );

    res.json({ 
      message: 'Screening score saved', 
      data: result.rows[0],
      cutoff,
      status
    });
  } catch (err) {
    console.error('Error saving screening score:', err);
    res.status(500).json({ error: 'Failed to save screening score' });
  }
};

// Step 7: Save Interview Decision
export const saveInterviewDecision = async (req, res) => {
  try {
    const { id } = req.params;
    const { interviewStatus, interviewFeedback } = req.body;

    // Validation
    const statusValidation = validateField('interviewStatus', interviewStatus, 'strict');
    if (!statusValidation.valid) {
      return res.status(400).json({
        error: 'Interview status validation failed',
        errors: statusValidation.errors
      });
    }

    // Block if rejected
    if (interviewStatus === 'Rejected') {
      return res.status(400).json({
        error: 'Application blocked',
        message: 'Rejected candidates cannot proceed to offer letter stage',
        blocked: true
      });
    }

    const result = await pool.query(
      `UPDATE applications 
       SET interview_status = $1, 
           interview_feedback = $2,
           current_step = 8
       WHERE id = $3
       RETURNING *`,
      [interviewStatus, interviewFeedback, id]
    );

    res.json({ 
      message: 'Interview decision saved', 
      data: result.rows[0],
      canProceed: ['Cleared', 'Waitlisted'].includes(interviewStatus)
    });
  } catch (err) {
    console.error('Error saving interview decision:', err);
    res.status(500).json({ error: 'Failed to save interview decision' });
  }
};

// Step 8: Send Offer Letter
export const sendOfferLetter = async (req, res) => {
  try {
    const { id } = req.params;
    const { admissionDetails } = req.body;

    // Get current application to check interview status
    const currentApp = await pool.query(
      'SELECT interview_status FROM applications WHERE id = $1',
      [id]
    );

    if (currentApp.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const interviewStatus = currentApp.rows[0].interview_status;

    // Business rule validation
    if (!['Cleared', 'Waitlisted'].includes(interviewStatus)) {
      return res.status(400).json({
        error: 'Offer letter validation failed',
        message: 'Offer letter can only be sent to candidates with Cleared or Waitlisted interview status',
        currentStatus: interviewStatus,
        allowedStatuses: ['Cleared', 'Waitlisted']
      });
    }

    const result = await pool.query(
      `UPDATE applications 
       SET offer_letter_sent = true, 
           admission_details = $1,
           admission_status = 'admitted',
           submitted_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [admissionDetails, id]
    );

    // TODO: Integrate with email service to send actual offer letter
    // const emailService = require('../services/emailService');
    // await emailService.sendOfferLetter(result.rows[0].email, result.rows[0]);

    res.json({ 
      message: 'Offer letter sent', 
      data: result.rows[0],
      interviewStatus
    });
  } catch (err) {
    console.error('Error sending offer letter:', err);
    res.status(500).json({ error: 'Failed to send offer letter' });
  }
};

// Get all applications (admin)
export const getAllApplications = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, full_name, current_step, screening_status, interview_status, created_at FROM applications ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

import pool from '../config/database.js';
import { validateApplication } from '../middleware/validation.js';

// Request exception for soft rule violations
export const requestException = async (req, res) => {
  try {
    const { id } = req.params;
    const { field, rationale, supportingDocuments } = req.body;

    // Get current application data
    const appResult = await pool.query(
      'SELECT * FROM applications WHERE id = $1',
      [id]
    );

    if (appResult.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const application = appResult.rows[0];

    // Check if this is a soft rule field
    const softRuleFields = ['dob', 'gradYear', 'cgpa', 'screeningScore'];
    if (!softRuleFields.includes(field)) {
      return res.status(400).json({
        error: 'Invalid field for exception',
        message: 'Exceptions can only be requested for soft rule violations',
        allowedFields: softRuleFields
      });
    }

    // Check if exception already exists for this field
    const existingException = await pool.query(
      'SELECT id FROM exceptions WHERE application_id = $1 AND field = $1 AND status = $2',
      [id, field, 'pending']
    );

    if (existingException.rows.length > 0) {
      return res.status(400).json({
        error: 'Exception already requested',
        message: 'An exception request for this field is already pending'
      });
    }

    // Create exception request
    const exceptionResult = await pool.query(
      `INSERT INTO exceptions 
       (application_id, field, rationale, supporting_documents, status, created_at)
       VALUES ($1, $2, $3, $4, 'pending', CURRENT_TIMESTAMP)
       RETURNING *`,
      [id, field, rationale, supportingDocuments]
    );

    res.status(201).json({
      message: 'Exception request submitted',
      exception: exceptionResult.rows[0],
      requiresManagerReview: true
    });

  } catch (err) {
    console.error('Error requesting exception:', err);
    res.status(500).json({ error: 'Failed to request exception' });
  }
};

// Get all exceptions for an application
export const getApplicationExceptions = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT e.*, a.full_name, a.email 
       FROM exceptions e
       JOIN applications a ON e.application_id = a.id
       WHERE e.application_id = $1
       ORDER BY e.created_at DESC`,
      [id]
    );

    res.json(result.rows);

  } catch (err) {
    console.error('Error fetching exceptions:', err);
    res.status(500).json({ error: 'Failed to fetch exceptions' });
  }
};

// Manager: Review exception request
export const reviewException = async (req, res) => {
  try {
    const { exceptionId } = req.params;
    const { status, managerFeedback, managerId } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'Status must be either "approved" or "rejected"'
      });
    }

    const result = await pool.query(
      `UPDATE exceptions 
       SET status = $1, manager_feedback = $2, manager_id = $3, reviewed_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [status, managerFeedback, managerId, exceptionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Exception not found' });
    }

    // If approved, update the application to allow progression
    if (status === 'approved') {
      await pool.query(
        `UPDATE applications 
         SET exceptions_approved = exceptions_approved + 1
         WHERE id = (SELECT application_id FROM exceptions WHERE id = $1)`,
        [exceptionId]
      );
    }

    res.json({
      message: `Exception ${status}`,
      exception: result.rows[0]
    });

  } catch (err) {
    console.error('Error reviewing exception:', err);
    res.status(500).json({ error: 'Failed to review exception' });
  }
};

// Manager: Get all pending exceptions
export const getPendingExceptions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, a.full_name, a.email, a.current_step
       FROM exceptions e
       JOIN applications a ON e.application_id = a.id
       WHERE e.status = 'pending'
       ORDER BY e.created_at ASC`
    );

    res.json(result.rows);

  } catch (err) {
    console.error('Error fetching pending exceptions:', err);
    res.status(500).json({ error: 'Failed to fetch pending exceptions' });
  }
};

// Check if application exceeds maximum exceptions
export const checkExceptionLimit = async (applicationId) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) as exception_count
       FROM exceptions 
       WHERE application_id = $1 AND status = 'approved'`,
      [applicationId]
    );

    const exceptionCount = parseInt(result.rows[0].exception_count);
    const maxExceptions = 2; // From validation rules

    return {
      withinLimit: exceptionCount <= maxExceptions,
      currentCount: exceptionCount,
      maxAllowed: maxExceptions,
      requiresManagerReview: exceptionCount > maxExceptions
    };

  } catch (err) {
    console.error('Error checking exception limit:', err);
    return {
      withinLimit: false,
      error: 'Failed to check exception limit'
    };
  }
};

// Validate complete application with exceptions
export const validateApplicationWithExceptions = async (req, res) => {
  try {
    const { id } = req.params;

    // Get application data
    const appResult = await pool.query(
      'SELECT * FROM applications WHERE id = $1',
      [id]
    );

    if (appResult.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const application = appResult.rows[0];

    // Get approved exceptions
    const exceptionsResult = await pool.query(
      `SELECT field FROM exceptions 
       WHERE application_id = $1 AND status = 'approved'`,
      [id]
    );

    const approvedExceptions = exceptionsResult.rows.map(row => row.field);

    // Validate application with exceptions considered
    const validation = validateApplication(application);
    
    // Remove soft errors for fields with approved exceptions
    validation.softErrors = validation.softErrors.filter(
      error => !approvedExceptions.includes(error.field)
    );

    // Check exception limit
    const exceptionCheck = await checkExceptionLimit(id);
    
    if (!exceptionCheck.withinLimit) {
      validation.requiresManagerReview = true;
      validation.valid = false;
      validation.systemErrors = [`Exceeded maximum allowed exceptions (${exceptionCheck.maxAllowed})`];
    }

    res.json({
      applicationId: id,
      validation,
      approvedExceptions,
      exceptionCount: exceptionCheck.currentCount,
      canProceed: validation.valid && !validation.requiresManagerReview
    });

  } catch (err) {
    console.error('Error validating application:', err);
    res.status(500).json({ error: 'Failed to validate application' });
  }
};

export default {
  requestException,
  getApplicationExceptions,
  reviewException,
  getPendingExceptions,
  checkExceptionLimit,
  validateApplicationWithExceptions
};

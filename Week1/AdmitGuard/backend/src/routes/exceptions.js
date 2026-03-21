import express from 'express';
import {
  requestException,
  getApplicationExceptions,
  reviewException,
  getPendingExceptions,
  validateApplicationWithExceptions
} from '../controllers/exceptionController.js';

const router = express.Router();

// Applicant routes
router.post('/applications/:id/exceptions', requestException);
router.get('/applications/:id/exceptions', getApplicationExceptions);
router.get('/applications/:id/validate', validateApplicationWithExceptions);

// Manager routes
router.get('/exceptions/pending', getPendingExceptions);
router.put('/exceptions/:exceptionId/review', reviewException);

export default router;

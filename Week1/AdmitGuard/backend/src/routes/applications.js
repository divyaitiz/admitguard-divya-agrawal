import express from 'express';
import * as applicationController from '../controllers/applicationController.js';

const router = express.Router();

// Create application
router.post('/create', applicationController.createApplication);

// Get application
router.get('/:id', applicationController.getApplication);

// Step 1: Personal Details
router.post('/:id/step1', applicationController.savePersonalDetails);

// Step 2: Identity Document
router.post('/:id/step2', applicationController.uploadIdentityDocument);

// Step 3: Academic Details
router.post('/:id/step3', applicationController.saveAcademicDetails);

// Step 4: Academic Documents
router.post('/:id/step4', applicationController.uploadAcademicDocuments);

// Step 5: AI Validation
router.post('/:id/step5', applicationController.validateDocumentsAI);

// Step 6: Screening Score
router.post('/:id/step6', applicationController.saveScreeningScore);

// Step 7: Interview Decision
router.post('/:id/step7', applicationController.saveInterviewDecision);

// Step 8: Offer Letter
router.post('/:id/step8', applicationController.sendOfferLetter);

// Admin: Get all applications
router.get('/', applicationController.getAllApplications);

export default router;

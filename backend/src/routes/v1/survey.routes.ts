import { Router } from 'express';
import { surveyController } from '@/controllers/survey.controller';
import  verifyAuth  from '@/middlewares/auth.middleware';

const router = Router();

router.use(verifyAuth);

// GET routes
router.get('/', surveyController.getAllSurveys);
router.get('/:id', surveyController.getSurveyById);
router.get('/:id/findings', surveyController.getSurveyFindings);
router.get('/:id/telemetry', surveyController.getSurveyTelemetry);
router.get('/:id/statistics', surveyController.getSurveyStatistics);

// POST routes
router.post('/', surveyController.createSurvey);
router.post('/:id/findings', surveyController.addSurveyFindings);

// PATCH routes
router.patch('/:id', surveyController.updateSurvey);
router.patch('/:id/status', surveyController.updateSurveyStatus);

export default router;

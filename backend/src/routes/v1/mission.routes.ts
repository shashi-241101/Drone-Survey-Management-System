import { Router } from 'express';
import { missionController } from '@/controllers/mission.controller';
import  verifyAuth  from '@/middlewares/auth.middleware';

const router = Router();

router.use(verifyAuth);

// GET routes
router.get('/', missionController.getAllMissions);
router.get('/:id', missionController.getMissionById);
router.get('/:id/telemetry', missionController.getMissionTelemetry);
router.get('/:id/survey', missionController.getMissionSurvey);

// POST routes
router.post('/', missionController.createMission);
router.post('/:id/start', missionController.startMission);
router.post('/:id/pause', missionController.pauseMission);
router.post('/:id/resume', missionController.resumeMission);
router.post('/:id/abort', missionController.abortMission);

// PATCH routes
router.patch('/:id', missionController.updateMission);

export default router;

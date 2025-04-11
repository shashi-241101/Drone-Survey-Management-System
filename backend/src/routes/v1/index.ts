import { Router } from 'express';
import authRoutes from './auth.routes';
import droneRoutes from './drone.routes';
import facilityRoutes from './facility.routes';
import missionRoutes from './mission.routes';
import surveyRoutes from './survey.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/drones', droneRoutes);
router.use('/facilities', facilityRoutes);
router.use('/missions', missionRoutes);
router.use('/surveys', surveyRoutes);

export default router;
import { Router } from 'express';
import { droneController } from '@/controllers/drone.controller';
import  verifyAuth  from '@/middlewares/auth.middleware';

const router = Router();

router.use(verifyAuth); // Protect all drone routes

// GET routes
router.get('/', droneController.getAllDrones);
router.get('/:id', droneController.getDroneById);
router.get('/:id/telemetry', droneController.getDroneTelemetry);
router.get('/:id/missions', droneController.getDroneMissions);

// POST routes
router.post('/', droneController.createDrone);

// PATCH routes
router.patch('/:id', droneController.updateDrone);
router.patch('/:id/status', droneController.updateDroneStatus);
router.patch('/:id/maintenance', droneController.scheduleMaintenance);

export default router;

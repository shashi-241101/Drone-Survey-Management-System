import { Router } from 'express';
import { facilityController } from '@/controllers/facility.controller';
import  verifyAuth  from '@/middlewares/auth.middleware';

const router = Router();

router.use(verifyAuth);

// GET routes
router.get('/', facilityController.getAllFacilities);
router.get('/:id', facilityController.getFacilityById);
router.get('/:id/missions', facilityController.getFacilityMissions);
router.get('/:id/drones', facilityController.getFacilityDrones);

// POST routes
router.post('/', facilityController.createFacility);

// PATCH routes
router.patch('/:id', facilityController.updateFacility);

export default router;

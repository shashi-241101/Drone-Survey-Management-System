import { Request, Response } from 'express';
import { Facility } from '@/models/facility.model';
import { Mission } from '@/models/mission.model';
import { Drone } from '@/models/drone.model';
import { AppError } from '@/utils/error';
import { catchAsync } from '@/utils/catch-async';

export const facilityController = {
    getAllFacilities: catchAsync(async (req: Request, res: Response) => {
        const facilities = await Facility.find();

        res.status(200).json({
            status: 'success',
            data: {
                facilities,
                count: facilities.length
            }
        });
    }),

    getFacilityById: catchAsync(async (req: Request, res: Response) => {
        const facility = await Facility.findById(req.params.id);
        
        if (!facility) {
            throw new AppError('Facility not found', 404);
        }

        res.status(200).json({
            status: 'success',
            data: { facility }
        });
    }),

    getFacilityMissions: catchAsync(async (req: Request, res: Response) => {
        const facility = await Facility.findById(req.params.id);
        
        if (!facility) {
            throw new AppError('Facility not found', 404);
        }

        const missions = await Mission.find({ facilityId: req.params.id })
            .sort({ createdAt: -1 }) // Sort by newest first
            .populate('droneId', 'name serialNumber'); // Include basic drone info

        res.status(200).json({
            status: 'success',
            data: {
                missions,
                count: missions.length
            }
        });
    }),

    getFacilityDrones: catchAsync(async (req: Request, res: Response) => {
        const facility = await Facility.findById(req.params.id);
        
        if (!facility) {
            throw new AppError('Facility not found', 404);
        }

        // Find all missions for this facility and get unique drone IDs
        const missions = await Mission.find({ facilityId: req.params.id });
        const droneIds = [...new Set(missions.map(mission => mission.droneId))];

        // Get all drones that have been assigned to this facility
        const drones = await Drone.find({
            _id: { $in: droneIds }
        });

        res.status(200).json({
            status: 'success',
            data: {
                drones,
                count: drones.length
            }
        });
    }),

    createFacility: catchAsync(async (req: Request, res: Response) => {
        // Validate that boundaries form a closed polygon if provided
        if (req.body.boundaries && req.body.boundaries.length < 3) {
            throw new AppError('Facility boundaries must form a valid polygon with at least 3 points', 400);
        }

        const facility = await Facility.create({
            ...req.body,
            // Add any additional fields or validations needed
        });

        res.status(201).json({
            status: 'success',
            data: { facility }
        });
    }),

    updateFacility: catchAsync(async (req: Request, res: Response) => {
        // Prevent updating certain fields if needed
        const restrictedFields = ['_id', 'createdAt'];
        restrictedFields.forEach(field => delete req.body[field]);

        // If updating boundaries, validate them
        if (req.body.boundaries && req.body.boundaries.length < 3) {
            throw new AppError('Facility boundaries must form a valid polygon with at least 3 points', 400);
        }

        const facility = await Facility.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true, // Return updated document
                runValidators: true // Run model validators
            }
        );

        if (!facility) {
            throw new AppError('Facility not found', 404);
        }

        res.status(200).json({
            status: 'success',
            data: { facility }
        });
    }),

    // Additional utility methods that might be needed internally
    private: {
        async validateBoundaries(boundaries: Array<{ latitude: number; longitude: number }>) {
            // Check if boundaries form a closed polygon
            if (boundaries.length < 3) return false;
            
            // Check if first and last points match to form a closed polygon
            const first = boundaries[0];
            const last = boundaries[boundaries.length - 1];
            
            return first.latitude === last.latitude && first.longitude === last.longitude;
        },

        async calculateArea(boundaries: Array<{ latitude: number; longitude: number }>) {
            // Implement area calculation using the Haversine formula
            // This would calculate the actual area in square meters
            // Implementation would go here
            return 0; // Placeholder return
        }
    }
};

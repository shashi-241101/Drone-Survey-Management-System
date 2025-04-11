import { Request, Response } from 'express';
import { Drone } from '@/models/drone.model';
import { CreateDroneDto, UpdateDroneDto } from '@/types/drone.types';
import { AppError } from '@/utils/error';
import { catchAsync } from '@/utils/catch-async';
import { telemetryService } from '@/services/telemetry.service';
import { Mission } from '@/models/mission.model';

export const droneController = {
    getAllDrones: catchAsync(async (req: Request, res: Response) => {
        const drones = await Drone.find();
        
        res.status(200).json({
            status: 'success',
            data: { drones }
        });
    }),

    getDroneById: catchAsync(async (req: Request, res: Response) => {
        const drone = await Drone.findById(req.params.id);
        if (!drone) {
            throw new AppError('Drone not found', 404);
        }

        res.status(200).json({
            status: 'success',
            data: { drone }
        });
    }),

    getDroneTelemetry: catchAsync(async (req: Request, res: Response) => {
        const drone = await Drone.findById(req.params.id);
        if (!drone) {
            throw new AppError('Drone not found', 404);
        }

        // Get real-time telemetry data from telemetry service
        const telemetry = await telemetryService.getDroneTelemetry(req.params.id);

        res.status(200).json({
            status: 'success',
            data: { telemetry }
        });
    }),

    getDroneMissions: catchAsync(async (req: Request, res: Response) => {
        const missions = await Mission.find({ droneId: req.params.id });

        res.status(200).json({
            status: 'success',
            data: { missions }
        });
    }),

    createDrone: catchAsync(async (req: Request, res: Response) => {
        const droneData: CreateDroneDto = req.body;
        const drone = await Drone.create(droneData);

        res.status(201).json({
            status: 'success',
            data: { drone }
        });
    }),

    updateDrone: catchAsync(async (req: Request, res: Response) => {
        const updateData: UpdateDroneDto = req.body;
        const drone = await Drone.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!drone) {
            throw new AppError('Drone not found', 404);
        }

        res.status(200).json({
            status: 'success',
            data: { drone }
        });
    }),

    updateDroneStatus: catchAsync(async (req: Request, res: Response) => {
        const { status } = req.body;
        const drone = await Drone.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!drone) {
            throw new AppError('Drone not found', 404);
        }

        res.status(200).json({
            status: 'success',
            data: { drone }
        });
    }),

    scheduleMaintenance: catchAsync(async (req: Request, res: Response) => {
        const drone = await Drone.findById(req.params.id);
        if (!drone) {
            throw new AppError('Drone not found', 404);
        }

        drone.status = 'maintenance';
        drone.lastMaintenance = new Date();
        await drone.save();

        res.status(200).json({
            status: 'success',
            data: { drone }
        });
    })
};

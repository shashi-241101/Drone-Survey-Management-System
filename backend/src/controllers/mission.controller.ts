import { Request, Response } from 'express';
import { Mission } from '@/models/mission.model';
import { CreateMissionDto, UpdateMissionDto } from '@/types/mission.types';
import { AppError } from '@/utils/error';
import { catchAsync } from '@/utils/catch-async';
import { telemetryService } from '@/services/telemetry.service';
import { Survey } from '@/models/survey.model';

export const missionController = {
    getAllMissions: catchAsync(async (req: Request, res: Response) => {
        const missions = await Mission.find();

        res.status(200).json({
            status: 'success',
            data: { missions }
        });
    }),

    getMissionById: catchAsync(async (req: Request, res: Response) => {
        const mission = await Mission.findById(req.params.id);
        if (!mission) {
            throw new AppError('Mission not found', 404);
        }

        res.status(200).json({
            status: 'success',
            data: { mission }
        });
    }),

    getMissionTelemetry: catchAsync(async (req: Request, res: Response) => {
        const mission = await Mission.findById(req.params.id);
        if (!mission) {
            throw new AppError('Mission not found', 404);
        }

        const telemetry = await telemetryService.getMissionTelemetry(req.params.id);

        res.status(200).json({
            status: 'success',
            data: { telemetry }
        });
    }),

    getMissionSurvey: catchAsync(async (req: Request, res: Response) => {
        const survey = await Survey.findOne({ missionId: req.params.id });
        if (!survey) {
            throw new AppError('Survey not found for this mission', 404);
        }

        res.status(200).json({
            status: 'success',
            data: { survey }
        });
    }),

    createMission: catchAsync(async (req: Request, res: Response) => {
        const missionData: CreateMissionDto = req.body;
        const mission = await Mission.create({
            ...missionData,
            createdBy: req.user.id
        });

        res.status(201).json({
            status: 'success',
            data: { mission }
        });
    }),

    startMission: catchAsync(async (req: Request, res: Response) => {
        const mission = await Mission.findById(req.params.id);
        if (!mission) {
            throw new AppError('Mission not found', 404);
        }

        mission.status = 'in-progress';
        await mission.save();

        // Initialize survey for this mission
        await Survey.create({ missionId: mission._id, startTime: new Date() });

        res.status(200).json({
            status: 'success',
            data: { mission }
        });
    }),

    pauseMission: catchAsync(async (req: Request, res: Response) => {
        const mission = await Mission.findById(req.params.id);
        if (!mission) {
            throw new AppError('Mission not found', 404);
        }

        mission.status = 'aborted'; // Changed from 'paused' to 'aborted' since that's a valid status
        await mission.save();

        res.status(200).json({
            status: 'success',
            data: { mission }
        });
    }),

    resumeMission: catchAsync(async (req: Request, res: Response) => {
        const mission = await Mission.findById(req.params.id);
        if (!mission) {
            throw new AppError('Mission not found', 404);
        }

        mission.status = 'in-progress';
        await mission.save();

        res.status(200).json({
            status: 'success',
            data: { mission }
        });
    }),

    abortMission: catchAsync(async (req: Request, res: Response) => {
        const mission = await Mission.findById(req.params.id);
        if (!mission) {
            throw new AppError('Mission not found', 404);
        }

        mission.status = 'aborted';
        await mission.save();

        // Update associated survey
        await Survey.findOneAndUpdate(
            { missionId: mission._id },
            { status: 'failed', endTime: new Date() }
        );

        res.status(200).json({
            status: 'success',
            data: { mission }
        });
    }),

    updateMission: catchAsync(async (req: Request, res: Response) => {
        const updateData: UpdateMissionDto = req.body;
        const mission = await Mission.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!mission) {
            throw new AppError('Mission not found', 404);
        }

        res.status(200).json({
            status: 'success',
            data: { mission }
        });
    })
};

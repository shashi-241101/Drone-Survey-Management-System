import { Request, Response } from 'express';
import { Survey } from '@/models/survey.model';
import { AppError } from '@/utils/error';
import { catchAsync } from '@/utils/catch-async';
import { telemetryService } from '@/services/telemetry.service';

export const surveyController = {
    getAllSurveys: catchAsync(async (req: Request, res: Response) => {
        const surveys = await Survey.find();

        res.status(200).json({
            status: 'success',
            data: { surveys }
        });
    }),

    getSurveyById: catchAsync(async (req: Request, res: Response) => {
        const survey = await Survey.findById(req.params.id);
        if (!survey) {
            throw new AppError('Survey not found', 404);
        }

        res.status(200).json({
            status: 'success',
            data: { survey }
        });
    }),

    getSurveyFindings: catchAsync(async (req: Request, res: Response) => {
        const survey = await Survey.findById(req.params.id);
        if (!survey) {
            throw new AppError('Survey not found', 404);
        }

        res.status(200).json({
            status: 'success',
            data: { findings: survey.findings }
        });
    }),

    getSurveyTelemetry: catchAsync(async (req: Request, res: Response) => {
        const survey = await Survey.findById(req.params.id);
        if (!survey) {
            throw new AppError('Survey not found', 404);
        }

        const telemetry = await telemetryService.getSurveyTelemetry(req.params.id);

        res.status(200).json({
            status: 'success',
            data: { telemetry }
        });
    }),

    getSurveyStatistics: catchAsync(async (req: Request, res: Response) => {
        const survey = await Survey.findById(req.params.id);
        if (!survey) {
            throw new AppError('Survey not found', 404);
        }

        res.status(200).json({
            status: 'success',
            data: { statistics: survey.data }
        });
    }),

    createSurvey: catchAsync(async (req: Request, res: Response) => {
        const surveyData = req.body;
        const survey = await Survey.create(surveyData);

        res.status(201).json({
            status: 'success',
            data: { survey }
        });
    }),

    addSurveyFindings: catchAsync(async (req: Request, res: Response) => {
        const { findings } = req.body;
        const survey = await Survey.findByIdAndUpdate(
            req.params.id,
            { $push: { findings: { $each: findings } } },
            { new: true, runValidators: true }
        );

        if (!survey) {
            throw new AppError('Survey not found', 404);
        }

        res.status(200).json({
            status: 'success',
            data: { survey }
        });
    }),

    updateSurvey: catchAsync(async (req: Request, res: Response) => {
        const updateData = req.body;
        const survey = await Survey.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!survey) {
            throw new AppError('Survey not found', 404);
        }

        res.status(200).json({
            status: 'success',
            data: { survey }
        });
    }),

    updateSurveyStatus: catchAsync(async (req: Request, res: Response) => {
        const { status } = req.body;
        const survey = await Survey.findByIdAndUpdate(
            req.params.id,
            { 
                status,
                ...(status === 'completed' && { endTime: new Date() })
            },
            { new: true, runValidators: true }
        );

        if (!survey) {
            throw new AppError('Survey not found', 404);
        }

        res.status(200).json({
            status: 'success',
            data: { survey }
        });
    })
};

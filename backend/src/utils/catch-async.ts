import {NextFunction, Request, Response, RequestHandler} from 'express';

export const catchAsync = (
    fn:(req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
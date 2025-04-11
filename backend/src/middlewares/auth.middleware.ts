import {Request, Response, NextFunction} from 'express';
import {logger} from '@/utils/logger';
import jwt from 'jsonwebtoken';
import {config} from '@/config';
import {AppError} from '@/utils/error';

declare global {
    namespace Express {
        interface Request{
            user?:{
                id?:string;
                _id?:string;
                [key:string]:any;
            }
        }
    }
}

interface DecodedToken{
    _id:string;
    id?:string;
    [key:string]:any;
}

/**
 * Middleware to verify the JWT Authentication token
 */

const verifyAuth = (req:Request, res:Response, next:NextFunction)=>{
// Get the token from the header
try{
const token = req.headers['authorization'] || req.headers['Authorization'];

if(!token){
    res.status(401).json({
        status: 'fail',
        message: 'Unauthorized request!!',
    })
}

// Extract the token from the header
const accessToken = (token as string).split(' ')[1];

const decode = jwt.verify(accessToken, config.accessTokenSecret as string) as DecodedToken;

if(!decode){
    res.status(403).json({
        status: 'fail',
        message: 'Invalid token , please login and try again',
    });
    return;
}

decode.id = decode._id;
req.user = decode;

next();
} catch(error){
    if(error instanceof jwt.TokenExpiredError){
        logger.error('Token expired');
        res.status(401).json({
            status: 'fail',
            message: 'Token expired, please login and try again',
        });
    }
    logger.error(error);
    next(new AppError('Invalid token, please login and try again', 403));
}

}

export default verifyAuth;

import {body, ValidationChain} from 'express-validator';
import mongoose from 'mongoose';

function isValidObjectId(id: string): boolean {

    if(mongoose.Types.ObjectId.isValid(id)){
        return (String)(new mongoose.Types.ObjectId(id)) === id;
    }
    return false;
}

export const useLoginValidation: ValidationChain[] = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')   
        .isEmail()
        .withMessage('Invalid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        // .isLength({min: 6})
];

export const useRegisterValidation: ValidationChain[] = [
    body('firstName')
        .notEmpty()
        .withMessage('First name is required'),
    body('lastName')
        .isString()
        .withMessage('Last name must be a string'),
    body('email')
        .notEmpty()
        .withMessage('Email is required')   
        .isEmail()
        .withMessage('Invalid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        // .isLength({min: 6})
]
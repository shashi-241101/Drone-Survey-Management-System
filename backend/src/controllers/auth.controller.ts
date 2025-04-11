import { Request, Response } from 'express';
import { User } from '@/models/user.model';
import { CreateUserDto, LoginDto } from '@/types/user.types';
import { generateToken, verifyRefreshToken } from '@/utils/jwt';
import { AppError } from '@/utils/error';
import { catchAsync } from '@/utils/catch-async';

export const authController = {
    register: catchAsync(async (req: Request, res: Response) => {
        const userData: CreateUserDto = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new AppError('Email already registered', 400);
        }

        const user = await User.create(userData);
        
        // Generate both access and refresh tokens
        const { accessToken, refreshToken } = generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            facilities: user.facilities.map(f => f.toString())
        });

        res.status(201).json({
            status: 'success',
            data: {
                user,
                accessToken,
                refreshToken
            }
        });
    }),

    login: catchAsync(async (req: Request, res: Response) => {
        const { email, password }: LoginDto = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            throw new AppError('Invalid email or password', 401);
        }

        // Generate both access and refresh tokens
        const { accessToken, refreshToken } = generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            facilities: user.facilities.map(f => f.toString())
        });

        // Update last login timestamp
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            status: 'success',
            data: {
                user,
                accessToken,
                refreshToken
            }
        });
    }),

    refreshToken: catchAsync(async (req: Request, res: Response) => {
        const { refreshToken: oldRefreshToken } = req.body;
        
        // Verify the refresh token
        const decoded = verifyRefreshToken(oldRefreshToken);
        
        const user = await User.findById(decoded.userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Generate new tokens
        const { accessToken, refreshToken } = generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            facilities: user.facilities.map(f => f.toString())
        });

        res.status(200).json({
            status: 'success',
            data: {
                accessToken,
                refreshToken
            }
        });
    }),

    logout: catchAsync(async (req: Request, res: Response) => {
        // In a more complex implementation, you might want to:
        // 1. Add the token to a blacklist
        // 2. Clear any session data
        // 3. Clear secure cookies if you're using them

        res.status(200).json({
            status: 'success',
            message: 'Logged out successfully'
        });
    }),

    getCurrentUser: catchAsync(async (req: Request, res: Response) => {
        const user = await User.findById(req.user.userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    }),

    changePassword: catchAsync(async (req: Request, res: Response) => {
        const { currentPassword, newPassword } = req.body;
        
        const user = await User.findById(req.user.userId);
        if (!user || !(await user.comparePassword(currentPassword))) {
            throw new AppError('Current password is incorrect', 401);
        }

        user.password = newPassword;
        await user.save();

        // Generate new tokens after password change
        const { accessToken, refreshToken } = generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            facilities: user.facilities.map(f => f.toString())
        });

        res.status(200).json({
            status: 'success',
            data: {
                message: 'Password updated successfully',
                accessToken,
                refreshToken
            }
        });
    })
};

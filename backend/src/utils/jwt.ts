import jwt, { SignOptions } from 'jsonwebtoken';
import { TokenPayload } from '@/types/user.types';
import { AppError } from './error';
import { config } from '@/config';

const ACCESS_TOKEN_EXPIRES_IN: string = '1d';
const REFRESH_TOKEN_EXPIRES_IN: string = '7d';

// Ensure the parameter type is definitely string
const generateJWT = (
    payload: TokenPayload,
    expiresIn: string,
    secret: string
): string => {
    try {
        // Explicitly type the options object
        const options: SignOptions = { expiresIn: expiresIn };
        // Now pass the options object containing the variable
        return jwt.sign(payload, secret, options);
    } catch (error) {
        console.error("JWT Generation Error:", error);
        throw new AppError('Error generating token', 500);
    }
};

export const generateToken = (payload: TokenPayload): { accessToken: string; refreshToken: string } => {
    if (!config.accessTokenSecret || !config.refreshTokenSecret) {
         console.error("Missing JWT secrets in configuration.");
         throw new AppError('Server configuration error', 500);
    }

    const accessToken = generateJWT(
        payload,
        ACCESS_TOKEN_EXPIRES_IN,
        config.accessTokenSecret
    );

    const refreshToken = generateJWT(
        payload,
        REFRESH_TOKEN_EXPIRES_IN,
        config.refreshTokenSecret
    );

    return { accessToken, refreshToken };
};

/**
 * Verify JWT token
 * @param token - Token to verify
 * @param secret - Secret key to verify the token
 */
const verifyJWT = (token: string, secret: string): TokenPayload => {
    try {
        return jwt.verify(token, secret) as TokenPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new AppError('Token has expired', 401);
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new AppError('Invalid token', 401);
        }
        throw new AppError('Token verification failed', 401);
    }
};

/**
 * Verify access token
 * @param token - Access token to verify
 */
export const verifyToken = (token: string): TokenPayload => {
    if (!token) {
        throw new AppError('No token provided', 401);
    }

    // Remove 'Bearer ' from token if present
    const tokenString = token.startsWith('Bearer ')
        ? token.slice(7)
        : token;

    return verifyJWT(tokenString, config.accessTokenSecret);
};

/**
 * Verify refresh token
 * @param token - Refresh token to verify
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
    if (!token) {
        throw new AppError('No refresh token provided', 401);
    }

    return verifyJWT(token, config.refreshTokenSecret);
};

/**
 * Extract token from authorization header
 * @param authHeader - Authorization header value
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string => {
    if (!authHeader) {
        throw new AppError('No authorization header', 401);
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
        throw new AppError('Invalid authorization header format', 401);
    }

    return token;
}; 
import dotenv from 'dotenv';

dotenv.config();

export const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_URL,
    jwtSecret: process.env.JWT_SECRET,
    serviceName: process.env.SERVICE_NAME,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    clientUrls: process.env.CLIENT_URL,
} as const;
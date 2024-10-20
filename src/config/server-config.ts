import DotenvFlow from 'dotenv-flow';

// Load environment variables from .env files.
DotenvFlow.config();

// Exporting application configuration settings.
export default {
    ENV: process.env.ENV, // Environment type (e.g., development, production).
    PORT: process.env.PORT, // Server port.
    SERVER_URL: process.env.SERVER_URL, // Base URL for the server.

    // Database Configuration
    DB_USER: process.env.DB_USER, // Database username.
    DB_PASS: process.env.DB_PASS, // Database password.
    DB_NAME: process.env.DB_NAME, // Database name.
    DB_HOST: process.env.DB_HOST, // Database host.

    // Frontend Configuration
    FRONTEND_URL: process.env.FRONTEND_URL,

    // Email Service
    RESEND: {
        EMAIL_SERVICE_API_KEY: process.env.EMAIL_SERVICE_API_KEY,
    },

    // Rate Limiting Configuration
    RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX), // Max requests in a time window.
    RATE_LIMIT_WINDOW: Number(process.env.RATE_LIMIT_WINDOW), // Duration for points validity.
    RATE_LIMIT_BLOCK_WINDOW: Number(process.env.RATE_LIMIT_BLOCK_WINDOW), // Block duration after limit exceeded.

    // Password Hash
    SALT_ROUNDS: Number(process.env.SALT_ROUNDS),

    // Access Token
    ACCESS_TOKEN: {
        SECRET: process.env.ACCESS_TOKEN_SECRET,
        EXPIRY: 3600,
    },

    // Refresh Token
    REFRESH_TOKEN: {
        SECRET: process.env.REFRESH_TOKEN_SECRET,
        EXPIRY: 3600 * 24 * 14,
    },

    // Nodemailer Service
    SMTP: {
        MAIL_SERVICE: process.env.MAIL_SERVICE,
        MAIL_HOST: process.env.SMTP_MAIL_HOST,
        MAIL_USERNAME: process.env.SMTP_MAIL_USERNAME,
        MAIL_PASSWORD: process.env.SMTP_MAIL_PASSWORD,
        MAIL_PORT: process.env.MAIL_PORT,
    },
    // Cloudinary Configuration
    CLOUDINARY: {
        CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        API_KEY: process.env.CLOUDINARY_API_KEY,
        API_SECRET: process.env.CLOUDINARY_API_SECRET,
    },
};

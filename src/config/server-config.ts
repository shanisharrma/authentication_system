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

    // Rate Limiting Configuration
    RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX, // Max requests in a time window.
    RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW, // Duration for points validity.
    RATE_LIMIT_BLOCK_WINDOW: process.env.RATE_LIMIT_BLOCK_WINDOW, // Block duration after limit exceeded.
};

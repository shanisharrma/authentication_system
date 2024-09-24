import { RateLimiterMySQL } from 'rate-limiter-flexible';
import { Sequelize } from 'sequelize';
import { ServerConfig } from '.';

// Initialize rate limiter variable.
export let rateLimiterMySQL: RateLimiterMySQL | null = null;

// Function to configure the rate limiter with a Sequelize connection.
export const initRateLimiter = (sequelizeConnection: Sequelize) => {
    rateLimiterMySQL = new RateLimiterMySQL({
        storeClient: sequelizeConnection, // MySQL connection client.
        dbName: ServerConfig.DB_NAME, // Database name for rate limiting.
        tableName: 'rate_limiter', // Table for storing rate limit data.
        keyPrefix: 'rate_limit_', // Key prefix for identifying rate limits.
        points: ServerConfig.RATE_LIMIT_MAX, // Max requests allowed.
        duration: ServerConfig.RATE_LIMIT_WINDOW, // Validity duration for points.
        blockDuration: ServerConfig.RATE_LIMIT_BLOCK_WINDOW, // Block duration after limit exceeded.
    });
};

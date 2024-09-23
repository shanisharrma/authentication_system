import app from './app'; // Import the Express application
import { initRateLimiter, ServerConfig } from './config'; // Import configuration and rate limiter initialization
import connection from './database/sequelize'; // Import the Sequelize database connection
import { Logger } from './utils/commons'; // Import the logging utility
import { EApplicationEvents } from './utils/constants'; // Import application events for logging

const server = app.listen(ServerConfig.PORT); // Start the server on the specified port

(() => {
    try {
        // Database connection check
        if (connection) {
            Logger.info(EApplicationEvents.DATABASE_CONNECTED, { meta: {} }); // Log successful DB connection
        }

        // Initialize Rate Limiter
        initRateLimiter(connection); // Set up rate limiting
        Logger.info(EApplicationEvents.RATE_LIMITER_INITIATED); // Log rate limiter initialization

        // Log application startup details
        Logger.info(EApplicationEvents.APPLICATION_STARTED, { meta: { PORT: ServerConfig.PORT, URL: ServerConfig.SERVER_URL } });
    } catch (error) {
        Logger.error(EApplicationEvents.APPLICATION_CONNECTION_ERROR, { meta: error }); // Log connection errors

        // Gracefully shut down the server in case of error
        server.close((error) => {
            if (error) {
                Logger.error(EApplicationEvents.APPLICATION_CONNECTION_ERROR, { meta: error });
            }
            process.exit(1); // Exit the process with failure code
        });
    }
})();

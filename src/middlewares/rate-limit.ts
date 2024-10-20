import { NextFunction, Request, Response } from 'express';
import { rateLimiterMySQL, ServerConfig } from '../config';
import { Enums, ResponseMessage } from '../utils/constants';
import { HttpError } from '../utils/commons';
import { StatusCodes } from 'http-status-codes';

// Middleware for rate limiting API requests.
export default (req: Request, _: Response, next: NextFunction) => {
    // Skip rate limiting in the development environment.
    if (ServerConfig.ENV === Enums.EApplicationEnvironment.DEVELOPMENT) {
        return next();
    }

    if (rateLimiterMySQL) {
        // Consume a point for the request based on the client's IP.
        rateLimiterMySQL
            .consume(req.ip as string, 1)
            .then(() => {
                next(); // Proceed to the next middleware if within limits.
            })
            .catch(() => {
                // Too many requests; return a 429 error.
                HttpError(next, new Error(ResponseMessage.TOO_MANY_REQUESTS), req, StatusCodes.TOO_MANY_REQUESTS);
            });
    }
};

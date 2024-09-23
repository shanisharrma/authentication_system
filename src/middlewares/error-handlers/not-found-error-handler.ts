import { NextFunction, Request, Response } from 'express';
import { ResponseMessage } from '../../utils/constants';
import { HttpError } from '../../utils/commons';
import { StatusCodes } from 'http-status-codes';

// Middleware to handle undefined routes (404 Not Found).
export default (req: Request, _: Response, next: NextFunction) => {
    try {
        // Throwing an error for a non-existent route.
        throw new Error(ResponseMessage.NOT_FOUND('Route'));
    } catch (error) {
        // Passing the error to the HttpError handler with a 404 status.
        HttpError(next, error, req, StatusCodes.NOT_FOUND);
    }
};

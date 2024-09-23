import { NextFunction, Request, Response } from 'express';
import { HttpError, HttpResponse } from '../utils/commons';
import { ResponseMessage } from '../utils/constants';
import { Quicker } from '../utils/helpers';
import { StatusCodes } from 'http-status-codes';

// ApiController class to handle API requests.
export class ApiController {
    // Method to respond with a success message.
    public static self(req: Request, res: Response, next: NextFunction) {
        try {
            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.SUCCESS);
        } catch (error) {
            // Handle errors by passing them to the next middleware.
            HttpError(next, error, req, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    // Method to check the health status of the application and system.
    public static health(req: Request, res: Response, next: NextFunction) {
        try {
            const healthData = {
                application: Quicker.getApplicationHealth(), // Get application health status.
                system: Quicker.getSystemHealth(), // Get system health status.
                timestamp: Date.now(), // Current timestamp.
            };

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.SUCCESS, healthData);
        } catch (error) {
            // Handle errors by passing them to the next middleware.
            HttpError(next, error, req, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

import { Request, Response } from 'express';
import { THttpResponse } from '../../types'; // Importing the type for structured HTTP responses.
import { ServerConfig } from '../../config';
import { EApplicationEnvironment, EApplicationEvents } from '../constants';
import { Logger } from '.'; // Importing the logger for logging responses.

// Middleware to format and send successful responses.
export default (req: Request, res: Response, responseStatusCode: number, responseMessage: string, data: unknown = null): void => {
    // Constructing the structured response object.
    const response: THttpResponse = {
        success: true,
        statusCode: responseStatusCode,
        request: {
            ip: req.ip || null, // Capturing the client's IP address.
            method: req.method, // HTTP method of the request.
            url: req.originalUrl, // Original request URL.
        },
        message: responseMessage, // Custom message for the response.
        data: data, // Optional data payload.
    };

    // Logging the successful response for monitoring.
    Logger.info(EApplicationEvents.CONTROLLER_SUCCESS_RESPONSE, { meta: response });

    // Production environment check to enhance privacy by removing IP from responses.
    if (ServerConfig.ENV === EApplicationEnvironment.PRODUCTION) {
        delete response.request.ip; // Remove IP address in production for privacy.
    }

    // Sending the response back to the client.
    res.status(responseStatusCode).json({ response });
};

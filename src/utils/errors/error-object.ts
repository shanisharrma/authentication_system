import { Request } from 'express'; // Importing Express Request type for type safety.
import { THttpError } from '../../types'; // Importing custom type for HTTP errors.
import { Enums, ResponseMessage } from '../constants'; // Importing constants for environment and responses.
import { ServerConfig } from '../../config'; // Importing server configuration settings.
import { Logger } from '../commons'; // Importing logger for logging errors.

export default (err: Error | unknown, req: Request, errorStatusCode: number = 500) => {
    // Constructing the error response object
    const errorObj: THttpError = {
        success: false,
        statusCode: errorStatusCode, // Status code for the response.
        request: {
            ip: req.ip || null, // Capturing request IP address.
            method: req.method, // HTTP method of the request.
            url: req.originalUrl, // URL of the request.
        },
        message: err instanceof Error ? err.message : ResponseMessage.SOMETHING_WENT_WRONG, // Error message.
        data: err, // Original error data for debugging.
        trace: err instanceof Error ? { error: err.stack } : null, // Stack trace for the error, if available.
    };

    // Log the error response using the logger
    Logger.error(Enums.EApplicationEvents.CONTROLLER_ERROR_RESPONSE, { meta: errorObj });

    // Check if the environment is production
    if (ServerConfig.ENV === Enums.EApplicationEnvironment.PRODUCTION) {
        // Remove sensitive information from the error response in production
        delete errorObj.request.ip; // Avoid exposing the client's IP address.
        delete errorObj.trace; // Avoid exposing stack traces in production.
    }

    return errorObj; // Return the constructed error object for the response.
};

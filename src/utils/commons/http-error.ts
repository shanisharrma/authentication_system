import { NextFunction, Request } from 'express';
import { ErrorObject } from '../errors'; // Importing a utility to format error responses.

// Middleware to handle errors and pass them to the next error handler.
export default (nextFunc: NextFunction, err: Error | unknown, req: Request, errorStatusCode: number = 500) => {
    // Creating a structured error object for consistent error handling.
    const errorObj = ErrorObject(err, req, errorStatusCode);
    nextFunc(errorObj); // Passing the error object to the next middleware.
};

import { NextFunction, Request, Response } from 'express';
import { THttpError } from '../../types';

// Error handling middleware to send error responses.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (err: THttpError, _: Request, res: Response, __: NextFunction) => {
    // Send JSON response with the error status code and details.
    res.status(err.statusCode).json(err);
};

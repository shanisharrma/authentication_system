import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { HttpError } from '../utils/commons';
import { StatusCodes } from 'http-status-codes';

// Middleware for validating incoming requests against a Joi schema.
export default {
    validateRequest: (schema: Joi.Schema) => {
        return (req: Request, _: Response, next: NextFunction) => {
            // Validate the request body using the provided schema.
            const { error, value } = schema.validate(req.body);

            if (error) {
                // If validation fails, pass the error to the HttpError handler.
                HttpError(next, error, req, StatusCodes.UNPROCESSABLE_ENTITY);
                return; // Exit early to prevent further processing.
            }

            req.body = value; // Assign the validated value back to req.body.
            next(); // Proceed to the next middleware.
        };
    },
};


import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/commons';
import { UserService } from '../services';
import AppError from '../utils/errors/app-error';
import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from '../utils/constants';

interface IAuthenticatedRequest extends Request {
    id: number;
}

class AuthMiddleware {
    private static userService: UserService = new UserService();

    public static async checkAuth(req: Request, _res: Response, next: NextFunction) {
        try {
            // destructure the req body to get authorization
            const { authorization } = req.headers;
            // Check Authorization exist or not
            if (!authorization) {
                throw new AppError(ResponseMessage.AUTHORIZATION_TOKEN_MISSING, StatusCodes.BAD_REQUEST);
            }
            // If exist --> get the token from authorization string
            const token = authorization.split(' ')[1];
            // Authenticate the token
            const response = await AuthMiddleware.userService.isAuthenticated(token);
            // Check authenticated or not ---> if yes --> call next()
            if (response) {
                (req as IAuthenticatedRequest).id = response;
                next();
            }
        } catch (error) {
            HttpError(next, error, req, error instanceof AppError ? error.statusCode : StatusCodes.BAD_REQUEST);
        }
    }
}

export default AuthMiddleware;

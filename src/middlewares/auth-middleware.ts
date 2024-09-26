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
            // destructure the req body to get access token from cookies
            const { cookies } = req;
            const { accessToken } = cookies;
            // Check access token exist or not
            if (!accessToken) {
                throw new AppError(ResponseMessage.AUTHORIZATION_TOKEN_MISSING, StatusCodes.BAD_REQUEST);
            }

            // Authenticate the token
            const response = await AuthMiddleware.userService.isAuthenticated(accessToken);
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

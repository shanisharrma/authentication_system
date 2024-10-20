import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/commons';
import { UserService } from '../services';
import AppError from '../utils/errors/app-error';
import { StatusCodes } from 'http-status-codes';
import { Enums, ResponseMessage } from '../utils/constants';

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
                throw new AppError(ResponseMessage.AUTHORIZATION_TOKEN_MISSING, StatusCodes.UNAUTHORIZED);
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

    private static async checkRole(req: Request, next: NextFunction, userRole: string) {
        try {
            const { cookies } = req as IAuthenticatedRequest;
            const { accessToken } = cookies;

            if (!accessToken) {
                throw new AppError(ResponseMessage.AUTHORIZATION_TOKEN_MISSING, StatusCodes.UNAUTHORIZED);
            }

            const userId = await AuthMiddleware.userService.isAuthorized(accessToken, userRole);

            if (!userId) {
                throw new AppError(ResponseMessage.INVALID_AUTHORIZATION_TOKEN, StatusCodes.UNAUTHORIZED);
            }

            (req as IAuthenticatedRequest).id = userId;
            next();
        } catch (error) {
            HttpError(next, error, req, error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public static async isUser(req: Request, _: Response, next: NextFunction) {
        return await AuthMiddleware.checkRole(req, next, Enums.EUserRole.USER);
    }

    public static async isModerator(req: Request, _: Response, next: NextFunction) {
        return await AuthMiddleware.checkRole(req, next, Enums.EUserRole.MODERATOR);
    }

    public static async isAdmin(req: Request, _: Response, next: NextFunction) {
        return await AuthMiddleware.checkRole(req, next, Enums.EUserRole.ADMIN);
    }
}

export default AuthMiddleware;

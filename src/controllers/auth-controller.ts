import { NextFunction, Request, Response } from 'express';
import { HttpError, HttpResponse } from '../utils/commons';
import { StatusCodes } from 'http-status-codes';
import { ILoginRequestBody, IRegisterRequestBody } from '../types/user-types';
import { EApplicationEnvironment, ResponseMessage } from '../utils/constants';
import { UserService } from '../services';
import AppError from '../utils/errors/app-error';
import { ServerConfig } from '../config';
import { Quicker } from '../utils/helpers';

interface IRegisterRequest extends Request {
    body: IRegisterRequestBody;
}

interface IConfirmRequest extends Request {
    params: {
        token: string;
    };
    query: {
        code: string;
    };
}

interface ILoginRequest extends Request {
    body: ILoginRequestBody;
}

interface IProfileRequest extends Request {
    id: number;
}

export class AuthController {
    private static userService: UserService = new UserService();

    public static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { body } = req as IRegisterRequest;

            const response = await AuthController.userService.register(body);

            HttpResponse(req, res, StatusCodes.CREATED, ResponseMessage.SUCCESS, { user: response.id });
        } catch (error) {
            HttpError(next, error, req, error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public static async confirmation(req: Request, res: Response, next: NextFunction) {
        try {
            const { params, query } = req as IConfirmRequest;

            const response = await AuthController.userService.confirmation({ token: params.token, code: query.code });

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.SUCCESS, response);
        } catch (error) {
            HttpError(next, error, req, error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { body } = req as ILoginRequest;
            const response = await AuthController.userService.login(body);

            // * Set Tokens to Response Cookie
            // ---> Extracting the base url

            const DOMAIN = Quicker.getDomainFromUrl(ServerConfig.SERVER_URL as string);

            const { accessToken, refreshToken } = response;

            res.cookie('refreshToken', refreshToken, {
                path: '/api/v1',
                domain: DOMAIN,
                sameSite: 'strict',
                maxAge: 1000 * ServerConfig.REFRESH_TOKEN.EXPIRY,
                httpOnly: true,
                secure: !(ServerConfig.ENV === EApplicationEnvironment.DEVELOPMENT),
            });

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.SUCCESS, accessToken);
        } catch (error) {
            HttpError(next, error, req, error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public static async profile(req: Request, res: Response, next: NextFunction) {
        try {
            // extract id from IProfileRequest
            const { id } = req as IProfileRequest;
            // get user with id
            const user = await AuthController.userService.profile(id);

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.SUCCESS, user);
        } catch (error) {
            HttpError(next, error, req, error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            // extract id from IProfileRequest
            const { cookies } = req;

            // get refreshToken from cookie
            const { refreshToken } = cookies as { refreshToken: string };

            // Logout the user
            await AuthController.userService.logout(refreshToken);

            // * Clear cookies
            // ---> Extracting the base url
            const DOMAIN = Quicker.getDomainFromUrl(ServerConfig.SERVER_URL as string);
            res.clearCookie('refreshToken', {
                path: '/api/v1',
                domain: DOMAIN,
                sameSite: 'strict',
                maxAge: 1000 * ServerConfig.REFRESH_TOKEN.EXPIRY,
                httpOnly: true,
                secure: !(ServerConfig.ENV === EApplicationEnvironment.DEVELOPMENT),
            });

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.SUCCESS);
        } catch (error) {
            HttpError(next, error, req, error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

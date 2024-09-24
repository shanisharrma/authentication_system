import { NextFunction, Request, Response } from 'express';
import { HttpError, HttpResponse } from '../utils/commons';
import { StatusCodes } from 'http-status-codes';
import { ILoginRequestBody, IRegisterRequestBody } from '../types/user-types';
import { EApplicationEnvironment, ResponseMessage } from '../utils/constants';
import { UserService } from '../services';
import AppError from '../utils/errors/app-error';
import { ServerConfig } from '../config';

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

            const url = new URL(ServerConfig.SERVER_URL as string);
            const DOMAIN = url.hostname;

            const { accessToken, refreshToken } = response;

            res.cookie('accessToken', accessToken, {
                path: '/api/v1',
                domain: DOMAIN,
                sameSite: 'strict',
                maxAge: 1000 * ServerConfig.ACCESS_TOKEN.EXPIRY,
                httpOnly: true,
                secure: !(ServerConfig.ENV === EApplicationEnvironment.DEVELOPMENT),
            }).cookie('refreshToken', refreshToken, {
                path: '/api/v1',
                domain: DOMAIN,
                sameSite: 'strict',
                maxAge: 1000 * ServerConfig.REFRESH_TOKEN.EXPIRY,
                httpOnly: true,
                secure: !(ServerConfig.ENV === EApplicationEnvironment.DEVELOPMENT),
            });

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.SUCCESS, response);
        } catch (error) {
            HttpError(next, error, req, error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

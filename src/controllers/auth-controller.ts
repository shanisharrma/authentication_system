import { NextFunction, Request, Response } from 'express';
import { HttpError, HttpResponse } from '../utils/commons';
import { StatusCodes } from 'http-status-codes';
import { IChangePasswordRequestBody, IForgotPasswordRequestBody, ILoginRequestBody, IRegisterRequestBody, IResetPasswordRequestBody } from '../types';
import { Enums, ResponseMessage } from '../utils/constants';
import { UserService } from '../services';
import { ServerConfig } from '../config';
import { Quicker } from '../utils/helpers';
import { AppError } from '../utils/errors';

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

interface IForgotPasswordRequest extends Request {
    body: IForgotPasswordRequestBody;
}

interface IResetPasswordRequest extends Request {
    params: {
        token: string;
    };
    body: IResetPasswordRequestBody;
}

interface IChangePasswordRequest extends Request {
    id: number;
    body: IChangePasswordRequestBody;
}

export class AuthController {
    private static userService: UserService = new UserService();

    public static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { body } = req as IRegisterRequest;

            const response = await AuthController.userService.register(body);

            HttpResponse(req, res, StatusCodes.CREATED, ResponseMessage.REGISTRATION_SUCCESS, { user: response.id });
        } catch (error) {
            HttpError(next, error, req, error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public static async confirmation(req: Request, res: Response, next: NextFunction) {
        try {
            const { params, query } = req as IConfirmRequest;

            const response = await AuthController.userService.confirmation({ token: params.token, code: query.code });

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.ACCOUNT_VERIFIED, response);
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

            res.cookie('accessToken', accessToken, {
                path: '/api/v1',
                domain: DOMAIN,
                sameSite: 'strict',
                maxAge: 1000 * ServerConfig.REFRESH_TOKEN.EXPIRY,
                httpOnly: true,
                secure: !(ServerConfig.ENV === Enums.EApplicationEnvironment.DEVELOPMENT),
            }).cookie('refreshToken', refreshToken, {
                path: '/api/v1',
                domain: DOMAIN,
                sameSite: 'strict',
                maxAge: 1000 * ServerConfig.REFRESH_TOKEN.EXPIRY,
                httpOnly: true,
                secure: !(ServerConfig.ENV === Enums.EApplicationEnvironment.DEVELOPMENT),
            });

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.LOGIN_SUCCESS, accessToken);
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

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.PROFILE_SUCCESS, user);
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
            res.clearCookie('accessToken', {
                path: '/api/v1',
                domain: DOMAIN,
                sameSite: 'strict',
                maxAge: 1000 * ServerConfig.ACCESS_TOKEN.EXPIRY,
                httpOnly: true,
                secure: !(ServerConfig.ENV === Enums.EApplicationEnvironment.DEVELOPMENT),
            }).clearCookie('refreshToken', {
                path: '/api/v1',
                domain: DOMAIN,
                sameSite: 'strict',
                maxAge: 1000 * ServerConfig.REFRESH_TOKEN.EXPIRY,
                httpOnly: true,
                secure: !(ServerConfig.ENV === Enums.EApplicationEnvironment.DEVELOPMENT),
            });

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.LOGIN_SUCCESS);
        } catch (error) {
            HttpError(next, error, req, error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public static async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            // * token from cookies
            const { cookies } = req;
            const { refreshToken } = cookies as { refreshToken: string };

            const accessToken = await AuthController.userService.refreshToken(refreshToken);

            // * Set Tokens to Response Cookie
            // ---> Extracting the base url

            const DOMAIN = Quicker.getDomainFromUrl(ServerConfig.SERVER_URL as string);
            res.cookie('accessToken', accessToken, {
                path: '/api/v1',
                domain: DOMAIN,
                sameSite: 'strict',
                maxAge: 1000 * ServerConfig.ACCESS_TOKEN.EXPIRY,
                httpOnly: true,
                secure: !(ServerConfig.ENV === Enums.EApplicationEnvironment.DEVELOPMENT),
            });
            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.TOKEN_REFRESH_SUCCESS, accessToken);
        } catch (error) {
            HttpError(next, error, req, error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public static async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            // * parse the request body
            const { body } = req as IForgotPasswordRequest;
            const { email } = body;
            //
            await AuthController.userService.forgotPassword(email);

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.FORGOT_PASSWORD_SENT_SUCCESS);
        } catch (error) {
            // Handle errors by passing them to the next middleware.
            HttpError(next, error, req, error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public static async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            // * parse the request body
            const { body, params } = req as IResetPasswordRequest;
            const { newPassword } = body;
            const { token } = params;
            //
            await AuthController.userService.resetPassword(token, newPassword);

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.PASSWORD_RESET_SUCCESS);
        } catch (error) {
            // Handle errors by passing them to the next middleware.
            HttpError(next, error, req, error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public static async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            // * parse the request body
            const { body, id } = req as IChangePasswordRequest;
            const { oldPassword, newPassword } = body;

            await AuthController.userService.changePassword(id, oldPassword, newPassword);

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.PASSWORD_CHANGE_SUCCESS);
        } catch (error) {
            // Handle errors by passing them to the next middleware.
            HttpError(next, error, req, error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

import { NextFunction, Request, Response } from 'express';
import { HttpError, HttpResponse } from '../utils/commons';
import { StatusCodes } from 'http-status-codes';
import { IRegisterRequestBody } from '../types/user-types';
import { ResponseMessage } from '../utils/constants';
import { UserService } from '../services';
import AppError from '../utils/errors/app-error';

interface IRegisterRequest extends Request {
    body: IRegisterRequestBody;
}

export class AuthController {
    private static userService: UserService = new UserService();

    public static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { body } = req as IRegisterRequest;

            const response = await AuthController.userService.register(body);

            HttpResponse(req, res, StatusCodes.CREATED, ResponseMessage.SUCCESS, response);
        } catch (error) {
            HttpError(next, error, req, error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

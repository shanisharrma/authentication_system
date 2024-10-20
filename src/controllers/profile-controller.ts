import { NextFunction, Request, Response } from 'express';
import { FileUploaderService, ProfileService } from '../services';
import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from '../utils/constants';
import { HttpError, HttpResponse } from '../utils/commons';
import { AppError } from '../utils/errors';
import { IProfileRequestBody, IProfileUpdateParams } from '../types';

interface IProfileRequest extends Request {
    body: IProfileRequestBody;
    file: Express.Multer.File;
    id: number;
}

class ProfileController {
    private static profileService: ProfileService = new ProfileService();

    public static async profile(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req as IProfileRequest;
            const response = await ProfileController.profileService.profile(id);

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.PROFILE_SUCCESS, response);
        } catch (error) {
            HttpError(next, error, req, error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public static async update(req: Request, res: Response, next: NextFunction) {
        try {
            // * destructure the req
            const { body, file, id } = req as IProfileRequest;

            // * destructure the body
            const { about, dateOfBirth, gender } = body;

            // * update profile data params
            const updateProfile: Partial<IProfileUpdateParams> = {
                about,
                dateOfBirth,
                gender,
                file: undefined,
            };

            // * check file exists
            if (file) {
                const validatedFile = FileUploaderService.validateFile(file, {
                    fieldName: file.fieldname,
                    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
                    maxSize: 1024 * 1024 * 5,
                });
                updateProfile.file = validatedFile;
            }

            const response = await ProfileController.profileService.update(id, updateProfile);

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.PROFILE_SUCCESS, response);
        } catch (error) {
            HttpError(next, error, req, error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default ProfileController;

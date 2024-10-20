import Joi, { ObjectSchema } from 'joi';
import {
    IChangePasswordRequestBody,
    IForgotPasswordRequestBody,
    ILoginRequestBody,
    IProfileRequestBody,
    IRegisterRequestBody,
    IResetPasswordRequestBody,
} from '../types';

export const registerSchema = Joi.object<IRegisterRequestBody, true>({
    name: Joi.string().min(2).max(72).trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(8).max(24).trim().required(),
    phoneNumber: Joi.string().min(4).max(20).required(),
    consent: Joi.boolean().valid(true).required(),
});

export const loginSchema = Joi.object<ILoginRequestBody, true>({
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(8).max(24).trim().required(),
});

export const forgotPasswordSchema = Joi.object<IForgotPasswordRequestBody, true>({
    email: Joi.string().email().trim().required(),
});

export const resetPasswordSchema = Joi.object<IResetPasswordRequestBody, true>({
    newPassword: Joi.string().min(8).max(24).trim().required(),
});

export const changePasswordSchema = Joi.object<IChangePasswordRequestBody, true>({
    oldPassword: Joi.string().min(8).max(24).trim().required(),
    newPassword: Joi.string().min(8).max(24).trim().required(),
    confirmNewPassword: Joi.string().min(8).max(24).trim().valid(Joi.ref('newPassword')).required(),
});

export const updateProfileSchema: ObjectSchema = Joi.object<Partial<IProfileRequestBody>, true>({
    about: Joi.string().trim().optional().messages({
        'string.empty': 'About cannot be empty.',
    }),
    dateOfBirth: Joi.string().trim().optional().messages({
        'string.empty': 'Date of Birth cannot be empty.',
    }),
    gender: Joi.string().trim().optional().messages({
        'string.empty': 'Gender cannot be empty.',
    }),
}).required();

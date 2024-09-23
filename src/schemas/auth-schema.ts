import Joi from 'joi';
import { IRegisterRequestBody } from '../types/user-types';

export const registerSchema = Joi.object<IRegisterRequestBody>({
    name: Joi.string().min(2).max(72).trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(8).max(24).trim().required(),
    phoneNumber: Joi.string().min(4).max(20).required(),
    consent: Joi.boolean().valid(true).required(),
});

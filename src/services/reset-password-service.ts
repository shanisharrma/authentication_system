import { StatusCodes } from 'http-status-codes';
import { ResetPasswordRepository } from '../repositories';
import { IResetPasswordAttributes } from '../types';
import { AppError } from '../utils/errors';
import { ResponseMessage } from '../utils/constants';

class ResetPasswordService {
    private resetpasswordRepository: ResetPasswordRepository;

    constructor() {
        this.resetpasswordRepository = new ResetPasswordRepository();
    }

    public async createResetPassword(data: IResetPasswordAttributes) {
        try {
            const { token, userId, expiresAt } = data;

            return await this.resetpasswordRepository.create({ token, userId, expiresAt });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async getResetPasswordWithUser(token: string) {
        try {
            if (!token) {
                throw new AppError(ResponseMessage.RESET_PASSWORD_MISSING, StatusCodes.BAD_REQUEST);
            }
            return await this.resetpasswordRepository.getResetPasswordWithUserByToken(token);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async updateResetPassword(id: number, options: Partial<IResetPasswordAttributes>) {
        try {
            return this.resetpasswordRepository.update(id, options);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default ResetPasswordService;

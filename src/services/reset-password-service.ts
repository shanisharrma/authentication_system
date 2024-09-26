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
}

export default ResetPasswordService;

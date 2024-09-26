import { StatusCodes } from 'http-status-codes';
import { RefreshTokenRepository } from '../repositories';
import { IRefreshTokenAttributes } from '../types';
import { ResponseMessage } from '../utils/constants';
import AppError from '../utils/errors/app-error';

class RefreshTokenService {
    private refreshTokenRepository: RefreshTokenRepository;

    constructor() {
        this.refreshTokenRepository = new RefreshTokenRepository();
    }

    public async createRefreshToken(payload: IRefreshTokenAttributes) {
        try {
            return await this.refreshTokenRepository.create(payload);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async deleteRefreshToken(token: string) {
        try {
            return await this.refreshTokenRepository.destroyByRefreshToken(token);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async findRefreshToken(token: string) {
        try {
            return await this.refreshTokenRepository.findByRefreshToken(token);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async findRefreshTokenByUserId(userId: number) {
        try {
            return await this.refreshTokenRepository.findRefreshTokenByUserId(userId);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async updateRefreshToken(id: number, options: Partial<IRefreshTokenAttributes>) {
        try {
            return this.refreshTokenRepository.update(id, options);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default RefreshTokenService;

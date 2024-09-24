import { RefreshTokenRepository } from '../repositories';
import { IRefreshTokenAttributes } from '../types';
import AppError from '../utils/errors/app-error';

class RefreshTokenService {
    private refreshTokenRepository: RefreshTokenRepository;

    constructor() {
        this.refreshTokenRepository = new RefreshTokenRepository();
    }

    public async createRefreshToken(payload: IRefreshTokenAttributes) {
        try {
            // const { token, userId, expiresAt, revoked } = payload;

            return await this.refreshTokenRepository.create(payload);
        } catch (error) {
            if (error instanceof AppError) throw new AppError(error.message, error.statusCode, error.data);
            throw error;
        }
    }
}

export default RefreshTokenService;

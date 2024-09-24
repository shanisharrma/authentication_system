import { StatusCodes } from 'http-status-codes';
import { Account_Confirmation, User } from '../database';
import { AccountConfirmationRepository } from '../repositories';
import { IAccountConfirmationAttributes } from '../types';
import { ResponseMessage } from '../utils/constants';
import AppError from '../utils/errors/app-error';

class AccountConfirmationService {
    private accountConfirmationRepository: AccountConfirmationRepository;

    constructor() {
        this.accountConfirmationRepository = new AccountConfirmationRepository();
    }

    public async createAccountConfirmation(data: IAccountConfirmationAttributes) {
        try {
            const { userId, code, status, timestamp, token } = data;

            const accountConfirmation = await this.accountConfirmationRepository.create({ code, status, token, userId, timestamp });

            return accountConfirmation;
        } catch (error) {
            if (error instanceof AppError) throw new AppError(error.message, error.statusCode, error.data);
            throw error;
        }
    }

    public async findUserByConfirmationToken(token: string, code: string) {
        try {
            const account = await Account_Confirmation.findOne({
                where: { token: token, code: code },
                include: [{ model: User, required: true, as: 'user' }],
            });

            if (!account) throw new AppError(ResponseMessage.RESOURCE_NOT_FOUND, StatusCodes.NOT_FOUND);
            return account;
        } catch (error) {
            if (error instanceof AppError) throw new AppError(error.message, error.statusCode, error.data);
            throw error;
        }
    }

    public async updateAccountConfirmation(id: number, data: Partial<Account_Confirmation>) {
        try {
            const updateAccount = await this.accountConfirmationRepository.update(id, data);
            return updateAccount;
        } catch (error) {
            if (error instanceof AppError) throw new AppError(error.message, error.statusCode);
            throw error;
        }
    }
}

export default AccountConfirmationService;

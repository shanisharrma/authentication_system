import { AccountConfirmationRepository } from '../repositories';
import { IAccountConfirmationAttributes } from '../types';

class AccountConfirmationService {
    private accountConfirmationRepository: AccountConfirmationRepository;

    constructor() {
        this.accountConfirmationRepository = new AccountConfirmationRepository();
    }

    public async createAccountConfirmation(data: IAccountConfirmationAttributes) {
        const { userId, code, status, timestamp, token } = data;

        const accountConfirmation = await this.accountConfirmationRepository.create({ code, status, token, userId, timestamp });

        return accountConfirmation;
    }
}

export default AccountConfirmationService;

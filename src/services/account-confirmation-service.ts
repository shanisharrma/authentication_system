import { AccountConfirmationRepository } from '../repositories';
import { IAccountConfirmation } from '../types/user-types';

class AccountConfirmationService {
    private accountConfirmationRepository: AccountConfirmationRepository;

    constructor() {
        this.accountConfirmationRepository = new AccountConfirmationRepository();
    }

    public async createAccountConfirmation(data: IAccountConfirmation) {
        const { userId, code, status, timestamp, token } = data;

        const accountConfirmation = await this.accountConfirmationRepository.create({ code, status, token, userId, timestamp });

        return accountConfirmation;
    }
}

export default AccountConfirmationService;

import { Account_Confirmation } from '../database';
import CrudRepository from './crud-repository';

class AccountConfirmationRepository extends CrudRepository<Account_Confirmation> {
    constructor() {
        super(Account_Confirmation);
    }

    public async getAccountConfirmationByUserId(userId: number) {
        return await this.getOne({ where: { userId: userId } });
    }
}

export default AccountConfirmationRepository;

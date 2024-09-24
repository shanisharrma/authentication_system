import { Account_Confirmation } from '../database';
import CrudRepository from './crud-repository';

class AccountConfirmationRepository extends CrudRepository<Account_Confirmation> {
    constructor() {
        super(Account_Confirmation);
    }
}

export default AccountConfirmationRepository;

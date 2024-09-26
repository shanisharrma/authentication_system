import { Reset_Password } from '../database/models';
import CrudRepository from './crud-repository';

class ResetPasswordRepository extends CrudRepository<Reset_Password> {
    constructor() {
        super(Reset_Password);
    }
}

export default ResetPasswordRepository;

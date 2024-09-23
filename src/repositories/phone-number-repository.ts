import { Phone_Number } from '../database/models';
import CrudRepository from './crud-repository';

class PhoneNumberRepository extends CrudRepository<Phone_Number> {
    constructor() {
        super(Phone_Number);
    }
}

export default PhoneNumberRepository;

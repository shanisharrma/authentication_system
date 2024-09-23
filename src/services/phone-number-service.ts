import PhoneNumberRepository from '../repositories/phone-number-repository';
import { IPhoneNumber } from '../types/user-types';

class PhoneNumberService {
    private phoneNumberRepository: PhoneNumberRepository;

    constructor() {
        this.phoneNumberRepository = new PhoneNumberRepository();
    }

    public async createNumber(data: IPhoneNumber) {
        const { countryCode, internationalNumber, isoCode, userId } = data;

        const phoneNumber = await this.phoneNumberRepository.create({ countryCode, internationalNumber, isoCode, userId });

        return phoneNumber;
    }
}

export default PhoneNumberService;

import PhoneNumberRepository from '../repositories/phone-number-repository';
import { IPhoneNumberAttributes } from '../types';

class PhoneNumberService {
    private phoneNumberRepository: PhoneNumberRepository;

    constructor() {
        this.phoneNumberRepository = new PhoneNumberRepository();
    }

    public async createNumber(data: IPhoneNumberAttributes) {
        const { countryCode, internationalNumber, isoCode, userId } = data;

        const phoneNumber = await this.phoneNumberRepository.create({ countryCode, internationalNumber, isoCode, userId });

        return phoneNumber;
    }
}

export default PhoneNumberService;

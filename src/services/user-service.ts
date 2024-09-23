import AppError from '../utils/errors/app-error';
import { User } from '../database';
import { EUserRole } from '../utils/constants/Enums';
import { IRegisterRequestBody } from '../types/user-types';
import { Quicker } from '../utils/helpers';
import { ResponseMessage } from '../utils/constants';
import { StatusCodes } from 'http-status-codes';
import PhoneNumberService from './phone-number-service';
import { RoleRepository, UserRepository } from '../repositories';

class UserService {
    private userRepository: UserRepository;
    private roleRepository: RoleRepository;
    private phoneNumberService: PhoneNumberService;

    constructor() {
        this.userRepository = new UserRepository();
        this.roleRepository = new RoleRepository();
        this.phoneNumberService = new PhoneNumberService();
    }

    public async register(data: IRegisterRequestBody) {
        try {
            const { consent, email, name, password, phoneNumber } = data;

            // Phone Number Parsing and Validation
            const { countryCode, internationalNumber, isoCode } = Quicker.parsePhoneNumber('+' + phoneNumber);

            if (!countryCode || !internationalNumber || !isoCode) {
                throw new AppError(ResponseMessage.INVALID_PHONE_NUMBER, StatusCodes.UNPROCESSABLE_ENTITY);
            }

            // * Getting Timezone
            const timezone = Quicker.getCountryTimeZone(isoCode);

            // Check timezone exits
            if (!timezone || timezone.length === 0) {
                throw new AppError(ResponseMessage.INVALID_PHONE_NUMBER, StatusCodes.UNPROCESSABLE_ENTITY);
            }

            // Check if user exists or not
            const exitingUser = await this.userRepository.findOneByEmail(email);
            if (exitingUser) {
                throw new AppError(ResponseMessage.ALREADY_EXIST('user', email), StatusCodes.FORBIDDEN);
            }

            const user = await User.create({
                name: name,
                email: email,
                password: password,
                consent: consent,
                timezone: timezone[0].name,
                lastLoginAt: null,
            });

            const role = await this.roleRepository.getRoleByName(EUserRole.USER);
            if (role) {
                user.addRole(role);
            } else {
                throw new AppError('user_role not creating');
            }

            const newPhoneNumber = await this.phoneNumberService.createNumber({ countryCode, isoCode, internationalNumber, userId: user.id });

            return { user, role, newPhoneNumber };
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError('Can not create user.', error.statusCode, error.stack);
            }
            throw error;
        }
    }
}

export default UserService;

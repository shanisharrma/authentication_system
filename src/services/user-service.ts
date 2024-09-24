import AppError from '../utils/errors/app-error';
import { EApplicationEvents, EUserRole } from '../utils/constants/Enums';
import { IRegisterRequestBody, IUserDetails } from '../types/user-types';
import { Quicker } from '../utils/helpers';
import { ResponseMessage } from '../utils/constants';
import { StatusCodes } from 'http-status-codes';
import PhoneNumberService from './phone-number-service';
import { RoleRepository, UserRepository } from '../repositories';
import AccountConfirmationService from './account-confirmation-service';
import { ServerConfig } from '../config';
import MailService from './mail-service';
import { Logger } from '../utils/commons';

class UserService {
    private userRepository: UserRepository;
    private roleRepository: RoleRepository;
    private phoneNumberService: PhoneNumberService;
    private accountConfirmationService: AccountConfirmationService;
    private mailService: MailService;

    constructor() {
        this.userRepository = new UserRepository();
        this.roleRepository = new RoleRepository();
        this.phoneNumberService = new PhoneNumberService();
        this.accountConfirmationService = new AccountConfirmationService();
        this.mailService = new MailService();
    }

    public async register(data: IRegisterRequestBody) {
        try {
            const { consent, email, name, password, phoneNumber } = data;

            // * Phone Number Parsing and Validation
            const { countryCode, internationalNumber, isoCode } = Quicker.parsePhoneNumber('+' + phoneNumber);

            if (!countryCode || !internationalNumber || !isoCode) {
                throw new AppError(ResponseMessage.INVALID_PHONE_NUMBER, StatusCodes.UNPROCESSABLE_ENTITY);
            }

            // * Getting Timezone
            const timezone = Quicker.getCountryTimeZone(isoCode);

            // * Check timezone exits
            if (!timezone || timezone.length === 0) {
                throw new AppError(ResponseMessage.INVALID_PHONE_NUMBER, StatusCodes.UNPROCESSABLE_ENTITY);
            }

            // * Check if user exists or not
            const exitingUser = await this.userRepository.findOneByEmail(email);
            if (exitingUser) {
                throw new AppError(ResponseMessage.ALREADY_EXIST('user', email), StatusCodes.FORBIDDEN);
            }

            // * Creating User
            const user = await this.userRepository.create({
                name: name,
                email: email,
                password: password,
                consent: consent,
                timezone: timezone[0].name,
                lastLoginAt: null,
            });

            // * Check if the role exists --> if yes, assign role to user --> if no, throw error
            const role = await this.roleRepository.getRoleByName(EUserRole.USER);
            if (role) {
                user.addRole(role);
            } else {
                throw new AppError(ResponseMessage.NOT_FOUND('role'), StatusCodes.NOT_FOUND);
            }

            // * Creating Phone Number entry
            const newPhoneNumber = await this.phoneNumberService.createNumber({ countryCode, isoCode, internationalNumber, userId: user.id });

            // * Creating OTP and Random Token --> Account Confirmation
            const confirmationToken = Quicker.generateRandomId();
            const confirmationCode = Quicker.generateOtp(6);

            const accountConfirmation = await this.accountConfirmationService.createAccountConfirmation({
                userId: user.id,
                status: false,
                token: confirmationToken,
                code: confirmationCode,
                timestamp: new Date(),
            });

            // * Create Email Body and Subject
            const confirmationUrl = `${ServerConfig.FRONTEND_URL}/confirmation/${confirmationToken}?code=${confirmationCode}`;
            const to = [user.email];
            const subject = `Confirm Your Account`;
            const text = `Hey ${user.name}, Please confirm your account by clicking on the link given below\n\n${confirmationUrl}`;

            // * Send Email
            this.mailService.sendEmail(to, subject, text).catch((error) => {
                Logger.error(EApplicationEvents.EMAIL_SERVICE, { meta: error });
            });

            const userDetails: IUserDetails = {
                user,
                role,
                phoneNumber: newPhoneNumber,
                accountConfirmation,
            };

            return userDetails;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(error.message, error.statusCode, error.stack);
            }
            throw error;
        }
    }
}

export default UserService;

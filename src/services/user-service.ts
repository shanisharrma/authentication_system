import AppError from '../utils/errors/app-error';
import { EApplicationEvents, EUserRole } from '../utils/constants/Enums';
import { ILoginRequestBody, IRefreshTokenAttributes, IRegisterRequestBody, IUserAttributes } from '../types';
import { Quicker } from '../utils/helpers';
import { ResponseMessage } from '../utils/constants';
import { StatusCodes } from 'http-status-codes';
import PhoneNumberService from './phone-number-service';
import { RoleRepository, UserRepository } from '../repositories';
import AccountConfirmationService from './account-confirmation-service';
import { ServerConfig } from '../config';
import MailService from './mail-service';
import { Logger } from '../utils/commons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import RefreshTokenService from './refresh-token-service';
import { JsonWebTokenError, JwtPayload, TokenExpiredError } from 'jsonwebtoken';

dayjs.extend(utc);

interface IDecryptedJWT extends JwtPayload {
    userId: number;
}

class UserService {
    private userRepository: UserRepository;
    private roleRepository: RoleRepository;
    private phoneNumberService: PhoneNumberService;
    private accountConfirmationService: AccountConfirmationService;
    private mailService: MailService;
    private refreshTokenService: RefreshTokenService;

    constructor() {
        this.userRepository = new UserRepository();
        this.roleRepository = new RoleRepository();
        this.phoneNumberService = new PhoneNumberService();
        this.accountConfirmationService = new AccountConfirmationService();
        this.mailService = new MailService();
        this.refreshTokenService = new RefreshTokenService();
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

            // sending user details
            const userDetails: IUserAttributes = {
                ...user,
                roles: [role],
                accountConfirmation,
                phoneNumber: newPhoneNumber,
            };

            return userDetails;
        } catch (error) {
            if (error instanceof AppError) throw error;

            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async confirmation(data: { token: string; code: string }) {
        try {
            // * Fetch User by confirmation Token
            const { token, code } = data;
            const accountConfirmation = await this.accountConfirmationService.findUserByConfirmationToken(token, code);
            if (!accountConfirmation || !accountConfirmation.user) {
                throw new AppError(ResponseMessage.INVALID_ACCOUNT_CONFIRMATION_TOKEN_OR_CODE, StatusCodes.BAD_REQUEST);
            }

            // * Check User already confirmed
            if (accountConfirmation.status) throw new AppError(ResponseMessage.ACCOUNT_ALREADY_CONFIRMED, StatusCodes.BAD_REQUEST);

            // * Account Confirmation
            const status = true;
            const timestamp = dayjs().utc().toDate();
            const accountConfirmed = await this.accountConfirmationService.updateAccountConfirmation(accountConfirmation.id, { status, timestamp });

            // // * Create Email Body and Subject
            const to = [accountConfirmation.user.email];
            const subject = `Account Confirmed`;
            const text = `Your account has been confirmed.`;

            // // * Send Account Confirmation Email
            this.mailService.sendEmail(to, subject, text).catch((error) => {
                Logger.error(EApplicationEvents.EMAIL_SERVICE, { meta: error });
            });

            return accountConfirmed;
        } catch (error) {
            if (error instanceof AppError) throw error;

            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async login(data: ILoginRequestBody) {
        try {
            // * Destructuring the req body
            const { email, password } = data;

            // * Find user
            const user = await this.userRepository.findOneByEmailWithPassword(email);
            if (!user) {
                throw new AppError(ResponseMessage.INCORRECT_EMAIL_OR_PASSWORD, StatusCodes.UNAUTHORIZED);
            }

            // * Validate password
            const isPasswordMatched = await Quicker.comparePassword(password, user.password);
            if (!isPasswordMatched) {
                throw new AppError(ResponseMessage.INCORRECT_EMAIL_OR_PASSWORD, StatusCodes.UNAUTHORIZED);
            }

            // * access token and refresh token
            const accessToken = Quicker.generateToken(
                { userId: user.id },
                ServerConfig.ACCESS_TOKEN.SECRET as string,
                ServerConfig.ACCESS_TOKEN.EXPIRY,
            );

            const refreshToken = Quicker.generateToken(
                { userId: user.id },
                ServerConfig.REFRESH_TOKEN.SECRET as string,
                ServerConfig.REFRESH_TOKEN.EXPIRY,
            );

            // * Last Login Information
            const lastLoginAt = dayjs().utc().toDate();
            await this.userRepository.update(user.id, { lastLoginAt });

            // * Refresh Token store
            const refreshTokenPayload: IRefreshTokenAttributes = {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + ServerConfig.REFRESH_TOKEN.EXPIRY),
                revoked: false,
            };

            await this.refreshTokenService.createRefreshToken(refreshTokenPayload);

            return { accessToken, refreshToken };
        } catch (error) {
            if (error instanceof AppError) throw error;

            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async isAuthenticated(token: string) {
        try {
            // * Check token exists or not
            if (!token) {
                throw new AppError(ResponseMessage.TOKEN_MISSING, StatusCodes.BAD_REQUEST);
            }

            // * Verify the token --> valid or not
            const { userId } = Quicker.verifyToken(token, ServerConfig.ACCESS_TOKEN.SECRET as string) as IDecryptedJWT;

            // * Fetch user with token payload
            const user = await this.userRepository.get(userId);

            // * check user exists or not
            if (!user) {
                throw new AppError(ResponseMessage.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
            }

            // * Return user id
            return user.id;
        } catch (error) {
            if (error instanceof AppError) throw error;
            if (error instanceof JsonWebTokenError) {
                if (error instanceof TokenExpiredError) {
                    throw new AppError(ResponseMessage.TOKEN_EXPIRED, StatusCodes.BAD_REQUEST);
                }
                throw new AppError(ResponseMessage.INVALID_TOKEN, StatusCodes.BAD_REQUEST);
            }
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async profile(id: number) {
        try {
            // get user of id with all the associations
            const user = await this.userRepository.getUserWithAssociations(id);
            return user;
        } catch (error) {
            if (error instanceof AppError) throw error;

            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default UserService;

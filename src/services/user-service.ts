import AppError from '../utils/errors/app-error';
import { Enums } from '../utils/constants';
import { ILoginRequestBody, IRefreshTokenAttributes, IRegisterRequestBody, IResetPasswordAttributes, IUserAttributes } from '../types';
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
import ResetPasswordService from './reset-password-service';

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
    private resetPasswordService: ResetPasswordService;

    constructor() {
        this.userRepository = new UserRepository();
        this.roleRepository = new RoleRepository();
        this.phoneNumberService = new PhoneNumberService();
        this.accountConfirmationService = new AccountConfirmationService();
        this.mailService = new MailService();
        this.refreshTokenService = new RefreshTokenService();
        this.resetPasswordService = new ResetPasswordService();
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
                throw new AppError(ResponseMessage.EMAIL_ALREADY_IN_USE, StatusCodes.FORBIDDEN);
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
            const role = await this.roleRepository.findByRole(Enums.EUserRole.USER);
            if (role) {
                user.addRole(role);
            } else {
                throw new AppError(ResponseMessage.NOT_FOUND('Role'), StatusCodes.NOT_FOUND);
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
                Logger.error(Enums.EApplicationEvents.EMAIL_SERVICE, { meta: error });
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
                throw new AppError(ResponseMessage.INVALID_VERIFICATION_CODE_TOKEN, StatusCodes.BAD_REQUEST);
            }

            // * Check User already confirmed
            if (accountConfirmation.status) throw new AppError(ResponseMessage.ACCOUNT_ALREADY_VERIFIED, StatusCodes.BAD_REQUEST);

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
                Logger.error(Enums.EApplicationEvents.EMAIL_SERVICE, { meta: error });
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
                throw new AppError(ResponseMessage.INVALID_CREDENTIALS, StatusCodes.UNAUTHORIZED);
            }

            // * Validate password
            const isPasswordMatched = await Quicker.comparePassword(password, user.password);
            if (!isPasswordMatched) {
                throw new AppError(ResponseMessage.INVALID_CREDENTIALS, StatusCodes.UNAUTHORIZED);
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

            // * Create Refresh Token Payload
            const refreshTokenPayload: IRefreshTokenAttributes = {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + ServerConfig.REFRESH_TOKEN.EXPIRY),
                revoked: false,
            };

            // * Check if refresh token exists for the user
            const rft = await this.refreshTokenService.findRefreshTokenByUserId(user.id);
            if (rft && rft.token) {
                await this.refreshTokenService.updateRefreshToken(rft.id, refreshTokenPayload);
            } else {
                await this.refreshTokenService.createRefreshToken(refreshTokenPayload);
            }

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
                throw new AppError(ResponseMessage.AUTHORIZATION_TOKEN_MISSING, StatusCodes.UNAUTHORIZED);
            }

            // * Verify the token --> valid or not
            const { userId } = Quicker.verifyToken(token, ServerConfig.ACCESS_TOKEN.SECRET as string) as IDecryptedJWT;

            // * Fetch user with token payload
            const user = await this.userRepository.get(userId);

            // * check user exists or not
            if (!user) {
                throw new AppError(ResponseMessage.AUTHORIZATION_REQUIRED, StatusCodes.UNAUTHORIZED);
            }

            // * Return user id
            return user.id;
        } catch (error) {
            if (error instanceof AppError) throw error;
            if (error instanceof JsonWebTokenError) {
                if (error instanceof TokenExpiredError) {
                    throw new AppError(ResponseMessage.AUTHORIZATION_TOKEN_EXPIRED, StatusCodes.UNAUTHORIZED);
                }
                throw new AppError(ResponseMessage.INVALID_AUTHORIZATION_TOKEN, StatusCodes.UNAUTHORIZED);
            }
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async isAuthorized(token: string, userRole: string) {
        try {
            if (!token) {
                throw new AppError(ResponseMessage.AUTHORIZATION_TOKEN_MISSING, StatusCodes.UNAUTHORIZED);
            }

            const { userId } = Quicker.verifyToken(token, ServerConfig.ACCESS_TOKEN.SECRET as string) as IDecryptedJWT;

            // check if user exists with userId
            const user = await this.userRepository.getOneById(userId);
            if (!user) {
                throw new AppError(ResponseMessage.AUTHORIZATION_REQUIRED, StatusCodes.UNAUTHORIZED);
            }

            // get student role from db
            const studentRole = await this.roleRepository.findByRole(userRole);
            if (!studentRole) {
                throw new AppError(ResponseMessage.NOT_FOUND(`User with role ${userRole}`), StatusCodes.NOT_FOUND);
            }

            // check if role is student of user
            const hasRole = await user.hasRole(studentRole);
            if (!hasRole) {
                throw new AppError(ResponseMessage.NOT_AUTHORIZED, StatusCodes.FORBIDDEN);
            }

            return user.id;
        } catch (error) {
            if (error instanceof AppError) throw error;
            if (error instanceof JsonWebTokenError) {
                if (error instanceof TokenExpiredError) {
                    throw new AppError(ResponseMessage.AUTHORIZATION_TOKEN_EXPIRED, StatusCodes.UNAUTHORIZED);
                }
                throw new AppError(ResponseMessage.INVALID_AUTHORIZATION_TOKEN, StatusCodes.UNAUTHORIZED);
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

    public async logout(token: string) {
        try {
            // * Check token exists or not
            if (!token) {
                throw new AppError(ResponseMessage.AUTHORIZATION_TOKEN_MISSING, StatusCodes.UNAUTHORIZED);
            }
            /**
             * Delete refresh token from the database ---> we have applied this
             * Or change the value of revoked in the database to true for auditing or security purposes
             * */
            await this.refreshTokenService.deleteRefreshToken(token);
        } catch (error) {
            if (error instanceof AppError) throw error;

            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async refreshToken(token: string) {
        try {
            // * Check token if exists or not
            if (!token) {
                throw new AppError(ResponseMessage.NOT_FOUND('Token'), StatusCodes.NOT_FOUND);
            }
            // * Get details of refresh token
            const rftDetails = await this.refreshTokenService.findRefreshToken(token);
            if (!rftDetails) {
                throw new AppError(ResponseMessage.SESSION_EXPIRED, StatusCodes.UNAUTHORIZED);
            }
            if (rftDetails.expiresAt.getTime() < new Date().getTime()) {
                await this.refreshTokenService.deleteRefreshToken(token);
                throw new AppError(ResponseMessage.SESSION_EXPIRED, StatusCodes.UNAUTHORIZED);
            }
            // * Get user id from rftDetails
            const { userId } = rftDetails;

            // * Generate new access token
            const accessToken = Quicker.generateToken(
                { userId: userId },
                ServerConfig.ACCESS_TOKEN.SECRET as string,
                ServerConfig.ACCESS_TOKEN.EXPIRY,
            );

            return accessToken;
        } catch (error) {
            if (error instanceof AppError) throw error;

            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async forgotPassword(email: string) {
        try {
            // * Find user by email address
            const user = await this.userRepository.getUserWithAccountConfirmationAndResetPasswordByEmail(email);
            if (!user) {
                throw new AppError(ResponseMessage.NOT_FOUND('User'), StatusCodes.NOT_FOUND);
            }

            // * Check if user account is confirmed
            if (user.accountConfirmation && !user.accountConfirmation.status) {
                throw new AppError(ResponseMessage.ACCOUNT_NOT_VERIFIED, StatusCodes.FORBIDDEN);
            }
            // * Generate Password reset Token and URL expiry
            const token = Quicker.generateRandomId();
            const expiresAt = Quicker.generateResetPasswordExpiry(15);

            // * Check if the user has reset password before
            if (user.resetPassword && (user.resetPassword.used || user.resetPassword.token)) {
                // * Update the existing reset password record
                await this.resetPasswordService.updateResetPassword(user.resetPassword.id!, { token, expiresAt });
            } else {
                // * Create reset Password
                await this.resetPasswordService.createResetPassword({ token, userId: user.id!, expiresAt });
            }

            // * Send email regarding forgot password
            const resetPasswordURL = `${ServerConfig.FRONTEND_URL}/reset-password/${token}`;
            const to = [user.email];
            const subject = `Account Password Reset Requested`;
            const text = `Hey ${user.name}, Please reset your account password by clicking on the line below.\n\n${resetPasswordURL}\n\nLink will expire within 15 minutes.`;

            this.mailService.sendEmail(to, subject, text);
        } catch (error) {
            if (error instanceof AppError) throw error;

            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async resetPassword(token: string, password: string) {
        try {
            // * Fetch user by token
            const resetPassDetails = await this.resetPasswordService.getResetPasswordWithUser(token);
            if (!resetPassDetails || (resetPassDetails && !resetPassDetails.user)) {
                throw new AppError(ResponseMessage.NOT_FOUND('User'), StatusCodes.NOT_FOUND);
            }

            // * check if user account is confirmed
            const accountConfirmation = await this.accountConfirmationService.getAccountConfirmationByUserId(resetPassDetails.userId);
            if (accountConfirmation && !accountConfirmation.status) {
                throw new AppError(ResponseMessage.ACCOUNT_NOT_VERIFIED, StatusCodes.FORBIDDEN);
            }

            // * check expiry of the url
            const storedExpiry = resetPassDetails.expiresAt;
            const currentTimestamp = dayjs().valueOf();
            if (currentTimestamp > storedExpiry) {
                await this.resetPasswordService.deleteResetPassword(resetPassDetails.id!);
                throw new AppError(ResponseMessage.EXPIRED_RESET_PASSWORD_URL, StatusCodes.BAD_REQUEST);
            }

            // * Has new password
            const hashedPassword = await Quicker.hashPassword(password);

            // * Update User with new password
            await this.userRepository.update(resetPassDetails.userId, { password: hashedPassword });
            const updatedResetPass: Partial<IResetPasswordAttributes> = {
                expiresAt: 0,
                token: '',
                used: true,
                lastResetAt: dayjs().utc().toDate(),
            };
            await this.resetPasswordService.updateResetPassword(resetPassDetails.id!, updatedResetPass);

            // * Send Email
            const to = [resetPassDetails.user!.email];
            const subject = `Account Password Reset`;
            const text = `Hey ${resetPassDetails.user?.name}, Your account password reset has been successfully performed.`;

            this.mailService.sendEmail(to, subject, text);
        } catch (error) {
            if (error instanceof AppError) throw error;

            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async changePassword(id: number, oldPassword: string, newPassword: string) {
        try {
            // * Find user by Id
            const userWithPassword = await this.userRepository.getUserWithPasswordById(id);
            if (!userWithPassword) {
                throw new AppError(ResponseMessage.NOT_FOUND('User'), StatusCodes.NOT_FOUND);
            }

            // * Check if old password is matching with stored password
            const isPasswordMatched = await Quicker.comparePassword(oldPassword, userWithPassword.password);
            if (!isPasswordMatched) {
                throw new AppError(ResponseMessage.INCORRECT_CURRENT_PASSWORD, StatusCodes.BAD_REQUEST);
            }

            // * Check if new Password is same
            if (newPassword === oldPassword) {
                throw new AppError(ResponseMessage.SIMILAR_CURRENT_PASSWORD_AND_NEW_PASSWORD, StatusCodes.BAD_REQUEST);
            }

            // * Hash new password
            const hashedPassword = await Quicker.hashPassword(newPassword);

            // * Update user with new hashed password
            await this.userRepository.update(userWithPassword.id, { password: hashedPassword });

            // * Prepare mail
            const to = [userWithPassword.email];
            const subject = `Password Changed`;
            const text = `Hey ${userWithPassword.name}, Your account password changed successfully.`;

            // * Send Email
            this.mailService.sendEmail(to, subject, text);
        } catch (error) {
            if (error instanceof AppError) throw error;

            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default UserService;

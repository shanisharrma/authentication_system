import { TWithAssociations } from './types';

export interface IUserAttributes {
    id?: number;
    name: string;
    email: string;
    password: string;
    timezone: string;
    lastLoginAt?: Date | null;
    consent: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    roles?: IRoleAttributes[];
    phoneNumber?: IPhoneNumberAttributes;
    profileDetails?: IProfileAttributes;
    accountConfirmation?: IAccountConfirmationAttributes;
    refreshToken?: IRefreshTokenAttributes;
    resetPassword?: IResetPasswordAttributes;
}

export interface IUserRoleAttributes {
    id?: number;
    userId: number;
    roleId: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export interface IRoleAttributes {
    id?: number;
    role: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    users?: IUserAttributes[];
}

export interface IPhoneNumberAttributes {
    id?: number;
    userId: number;
    isoCode: string;
    countryCode: string;
    internationalNumber: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    user?: IUserAttributes;
}

export interface IAccountConfirmationAttributes {
    id?: number;
    userId: number;
    status: boolean;
    token: string;
    code: string;
    timestamp?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    user?: IUserAttributes;
}

export interface IRefreshTokenAttributes {
    id?: number;
    userId: number;
    token: string;
    expiresAt: Date;
    revoked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    user?: IUserAttributes;
}

export interface IResetPasswordAttributes {
    id?: number;
    userId: number;
    token: string;
    expiresAt: number;
    lastResetAt?: Date;
    used?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    user?: IUserAttributes;
}

export interface IProfileAttributes {
    id?: number;
    userId: number;
    gender: string | null;
    dateOfBirth: string | null;
    about: string | null;
    imageUrl: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    user?: IUserAttributes;
}

export interface IRegisterRequestBody {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    consent: boolean;
}

export interface ILoginRequestBody {
    email: string;
    password: string;
}

export interface IForgotPasswordRequestBody {
    email: string;
}

export interface IResetPasswordRequestBody {
    newPassword: string;
}

export interface IChangePasswordRequestBody {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface IProfileRequestBody {
    about: string;
    dateOfBirth: string;
    gender: string;
}

export interface IProfileUpdateParams extends IProfileAttributes {
    file: Express.Multer.File | undefined;
}

export type TAccountConfirmationWithUser = TWithAssociations<IAccountConfirmationAttributes, { user: IUserAttributes }>;

export type TUserWithAssociations = TWithAssociations<
    IUserAttributes,
    {
        accountConfirmation: IAccountConfirmationAttributes;
        phoneNumber: IPhoneNumberAttributes;
        role: IRoleAttributes[];
        profile: IProfileAttributes;
    }
>;

export type TUserWithAccountConfirmationAndResetPassword = TWithAssociations<
    IUserAttributes,
    { accountConfirmation: IAccountConfirmationAttributes; resetPassword: IResetPasswordAttributes }
>;

export type TResetPasswordWithUser = TWithAssociations<IResetPasswordAttributes, { user: IUserAttributes }>;

export type TProfileWithUserAssociations = TWithAssociations<
    IProfileAttributes,
    {
        user: IUserAttributes;
        phoneNumber: IPhoneNumberAttributes;
        accountConfirmation: IAccountConfirmationAttributes;
    }
>;

export type TUserWithProfileAssociations = TWithAssociations<IUserAttributes, { profileDetails: IProfileAttributes }>;

export type WithAssociations<T, Associations> = T & Partial<Associations>;

export type IUserWithAssociations = WithAssociations<
    IUserAttributes,
    {
        roles: IRoleAttributes[];
        phoneNumber: IPhoneNumberAttributes;
        accountConfirmation: IAccountConfirmationAttributes;
    }
>;

export type IUserWithAccountConfirmation = WithAssociations<IUserAttributes, { accountConfirmation: IAccountConfirmationAttributes }>;

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
    accountConfirmation?: IAccountConfirmationAttributes;
    refreshToken?: IRefreshTokenAttributes[];
    resetPassword?: IResetPasswordAttributes[];
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

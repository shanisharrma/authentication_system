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
}

export interface IUserDetails {
    user: IUserAttributes;
    role: IRoleAttributes;
    phoneNumber: IPhoneNumberAttributes;
    accountConfirmation: IAccountConfirmationAttributes;
}

export interface IRegisterRequestBody {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    consent: boolean;
}

export interface IUser {
    name: string;
    email: string;
    password: string;
    timezone: string;
    lastLoginAt: Date;
    consent: boolean;
}

export interface IPhoneNumber {
    userId: number;
    isoCode: string;
    countryCode: string;
    internationalNumber: string;
}

export interface IAccountConfirmation {
    userId: number;
    status: boolean;
    token: string;
    code: string;
    timestamp: Date;
}

export interface ICreatedUser {
    user: IUser;
    phoneNumber?: IPhoneNumber;
    accountConfirmation?: IAccountConfirmation;
}

export interface IRegisterRequestBody {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    consent: boolean;
}

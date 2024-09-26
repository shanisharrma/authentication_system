export default {
    SUCCESS: `The operation has been successful.`,
    SOMETHING_WENT_WRONG: `Something went wrong.`,
    TOO_MANY_REQUESTS: `Too many request! Please try again later.`,
    INVALID_PHONE_NUMBER: `Invalid phone number.`,
    RESOURCE_NOT_FOUND: `Resource not found`,
    INVALID_ACCOUNT_CONFIRMATION_TOKEN_OR_CODE: `Invalid account confirmation token or code.`,
    ACCOUNT_ALREADY_CONFIRMED: `Account already confirmed.`,
    INCORRECT_EMAIL_OR_PASSWORD: `Incorrect email address or password.`,
    AUTHORIZATION_TOKEN_MISSING: `Authorization token doesn't exists`,
    AUTHORIZATION_TOKEN_EXPIRED: `Authorization token expired.`,
    INVALID_AUTHORIZATION_TOKEN: `Invalid authorization token.`,
    UNAUTHORIZED: `You are not authorized to perform this action.`,
    SESSION_EXPIRED: `Session expired.`,

    NOT_FOUND: (entity: string) => `${entity} Not Found!`,
    ALREADY_EXIST: (entity: string, identifier: string) => `${entity} already exists with this ${identifier}`,
};

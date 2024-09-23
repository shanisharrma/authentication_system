export default {
    SUCCESS: `The operation has been successful.`,
    SOMETHING_WENT_WRONG: `Something went wrong.`,
    TOO_MANY_REQUESTS: `Too many request! Please try again later.`,
    INVALID_PHONE_NUMBER: `Invalid phone number.`,
    RESOURCE_NOT_FOUND: `Resource not found`,

    NOT_FOUND: (entity: string) => `${entity} Not Found!`,
    ALREADY_EXIST: (entity: string, identifier: string) => `${entity} already exists with this ${identifier}`,
};

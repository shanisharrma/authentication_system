export default {
    SUCCESS: `The operation has been successful.`, //200
    REGISTRATION_SUCCESS: `Registration successful. Please verify your email to activate your account.`, //201
    EMAIL_ALREADY_IN_USE: `Email already in use.`, //400
    INVALID_DATA: `Invalid registration data.`, //422
    ACCOUNT_VERIFIED: `Account successfully verified.`, //200
    ACCOUNT_ALREADY_VERIFIED: `Account already verified.`, //400
    INVALID_VERIFICATION_CODE_TOKEN: `Invalid verification code or token.`, //400
    VERIFICATION_LINK_EXPIRED: `Verification link expired or user not found.`, //404
    LOGIN_SUCCESS: `Login successful.`, //200
    INVALID_CREDENTIALS: `Invalid credentials.`, //401
    ACCOUNT_NOT_VERIFIED: `Account not verified. Please verify your email.`, //403
    PROFILE_SUCCESS: `Profile retrieved successfully.`, //200
    AUTHORIZATION_REQUIRED: `Authentication required.`, //401
    PROFILE_NOT_FOUND: `User profile not found.`, //404
    LOGOUT_SUCCESS: `Logout successful.`, //200
    NOT_LOGGED_IN: `You are not logged in.`, //401
    TOKEN_REFRESH_SUCCESS: `Token refreshed successfully.`, //200
    INVALID_OR_TOKEN_EXPIRED: `Invalid or expired refresh token.`, //401
    FORGOT_PASSWORD_SENT_SUCCESS: `Password reset instructions sent to your email.`, //200
    EMAIL_NOT_FOUND: `Email not registered.`, //404
    PASSWORD_RESET_SUCCESS: `Password successfully reset.`, //200
    PASSWORD_RESET_TOKEN_MISSING: `Reset password token missing.`,
    INVALID_OR_EXPIRED_RESET_TOKEN: `Invalid or expired reset token.`, //400
    INVALID_PASSWORD: `Password does not meet criteria.`, //422
    PASSWORD_CHANGE_SUCCESS: `Password successfully changed.`, //200
    INCORRECT_CURRENT_PASSWORD: `Current password is incorrect.`, //400
    INVALID_PHONE_NUMBER: `Invalid phone number.`, //422
    SOMETHING_WENT_WRONG: `Something went wrong. Please try again later.`, //500
    AUTHORIZATION_TOKEN_MISSING: `Authorization token doesn't exists`, //401
    AUTHORIZATION_TOKEN_EXPIRED: `Authorization token expired.`, //401
    INVALID_AUTHORIZATION_TOKEN: `Invalid authorization token.`, //401
    SESSION_EXPIRED: `Session expired. Please log in again.`, //401
    EXPIRED_RESET_PASSWORD_URL: `Reset password link has expired. Please request a new one.`, //400
    SIMILAR_CURRENT_PASSWORD_AND_NEW_PASSWORD: `New password cannot be the same as the old password. Please choose a different password.`, //400
    TOO_MANY_REQUESTS: `Too many request! Please try again later.`, //429
    NOT_AUTHORIZED: `You are not authorized to access.`, //403
    FILE_TOO_LARGE: `File is too large`, //413
    TOO_MANY_FILES: `Too many files uploaded`, //400

    NOT_FOUND: (entity: string) => `${entity} Not Found!`, //404
    ALREADY_EXIST: (entity: string, identifier: string) => `${entity} already exists with this ${identifier}`, //400
};

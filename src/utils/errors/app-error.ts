/**
 * Class AppError
 *
 *  A generic custom error class that extends the built-in Error class.
 *  The generic type T allows you to specify the type of the `data` field (defaults to unknown).
 *
 */
class AppError<T = unknown> extends Error {
    // The HTTP status code associated with the error.
    statusCode: number;

    // Optional data related to the error (type can be specified using T).
    data?: T;

    // Constructor to initialize the error message, status code, and optional data.
    constructor(message: string, statusCode: number = 500, data?: T) {
        super(message); // Call the parent (Error) constructor with the message.
        this.name = this.constructor.name; // Set the error's name to the class name (AppError).
        this.statusCode = statusCode; // Assign the status code.
        this.data = data; // Assign the optional data if provided.
        // Capture the current stack trace for debugging purposes.
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;

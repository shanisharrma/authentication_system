// Type definitions for HTTP responses and errors.

export type THttpResponse = {
    success: boolean; // Indicates if the request was successful.
    statusCode: number; // HTTP status code of the response.
    request: {
        ip?: string | null; // Client's IP address (optional).
        method: string; // HTTP method used (GET, POST, etc.).
        url: string; // Request URL.
    };
    message: string; // Descriptive message about the response.
    data: unknown; // Payload containing response data (could be any type).
};

// Type definition for HTTP errors.
export type THttpError = {
    success: boolean; // Indicates if the error was handled successfully.
    statusCode: number; // HTTP status code for the error.
    request: {
        ip?: string | null; // Client's IP address (optional).
        method: string; // HTTP method used.
        url: string; // Request URL.
    };
    message: string; // Descriptive message about the error.
    data: unknown; // Optional data related to the error.
    trace?: object | null; // Optional stack trace or error details for debugging.
};

export interface ILogAttributes {
    id?: number;
    level: string;
    message: string;
    meta?: string;
    timestamp: Date;
    createdAt?: Date;
    deletedAt?: Date;
    updatedAt?: Date;
}

export type TWithAssociations<T, Associations> = T & Partial<Associations>;

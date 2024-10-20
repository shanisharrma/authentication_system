export enum EApplicationEnvironment {
    PRODUCTION = 'production',
    DEVELOPMENT = 'development',
}

export enum EApplicationEvents {
    APPLICATION_STARTED = 'APPLICATION_STARTED',
    APPLICATION_CONNECTION_ERROR = 'APPLICATION_CONNECTION_ERROR',
    DATABASE_CONNECTED = 'DATABASE_CONNECTED',
    RATE_LIMITER_INITIATED = 'RATE_LIMITER_INITIATED',
    DATABASE_DISCONNECTED = 'DATABASE_DISCONNECTED',
    CONTROLLER_SUCCESS_RESPONSE = 'CONTROLLER_SUCCESS_RESPONSE',
    CONTROLLER_ERROR_RESPONSE = 'CONTROLLER_ERROR_RESPONSE',
    EMAIL_SERVICE_ERROR = 'EMAIL_SERVICE_ERROR',
}

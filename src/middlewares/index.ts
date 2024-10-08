import GlobalErrorHandler from './error-handlers/global-error-handler';
import NotFoundErrorHandler from './error-handlers/not-found-error-handler';
import RateLimit from './rate-limit';
import ValidateRequestMiddleware from './validate-request';
import AuthMiddleware from './auth-middleware';

// Exporting all the middlewares
export { GlobalErrorHandler, NotFoundErrorHandler, RateLimit, ValidateRequestMiddleware, AuthMiddleware };

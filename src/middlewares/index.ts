import GlobalErrorHandler from './error-handlers/global-error-handler';
import NotFoundErrorHandler from './error-handlers/not-found-error-handler';
import RateLimit from './rate-limit';
import ValidateRequestMiddleware from './validate-request';

// Exporting all the middlewares
export { GlobalErrorHandler, NotFoundErrorHandler, RateLimit, ValidateRequestMiddleware };

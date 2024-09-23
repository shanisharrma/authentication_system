import GlobalErrorHandler from './error-handlers/global-error-handler';
import NotFoundErrorHandler from './error-handlers/not-found-error-handler';
import RateLimit from './rate-limit';

// Exporting all the middlewares
export { GlobalErrorHandler, NotFoundErrorHandler, RateLimit };

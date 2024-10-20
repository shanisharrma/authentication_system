import RateLimit from './rate-limit';
import ValidationMiddleware from './validation-middleware';
import AuthMiddleware from './auth-middleware';
import ErrorMiddleware from './error-middleware';
import upload from './multer-middleware';

// Exporting all the middlewares
export { RateLimit, ValidationMiddleware, AuthMiddleware, ErrorMiddleware, upload };

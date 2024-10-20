import { Router } from 'express';
import { AuthController } from '../../controllers';
import { AuthMiddleware, RateLimit, ValidationMiddleware } from '../../middlewares';
import schemas from '../../schemas';

const router = Router();

// Register : POST /api/v1/register
router.route('/register').post(RateLimit, ValidationMiddleware.validateRequest(schemas.registerSchema), AuthController.register);

// Account Confirmation : PUT /api/v1/confirmation/:token?code=
router.route('/confirmation/:token').put(RateLimit, AuthController.confirmation);

// Login : POST /api/v1/login
router.route('/login').post(RateLimit, ValidationMiddleware.validateRequest(schemas.loginSchema), AuthController.login);

// Logout : PUT /api/v1/logout
router.route('/logout').put(AuthMiddleware.checkAuth, AuthController.logout);

// Refresh Token : POST /api/v1/refresh-token
router.route('/refresh-token').post(RateLimit, AuthController.refreshToken);

// Forgot Password : POST /api/v1/forgot-password
router.route('/forgot-password').post(RateLimit, ValidationMiddleware.validateRequest(schemas.forgotPasswordSchema), AuthController.forgotPassword);

// Reset Password : PUT /api/v1/reset-password/:token
router
    .route('/reset-password/:token')
    .put(RateLimit, ValidationMiddleware.validateRequest(schemas.resetPasswordSchema), AuthController.resetPassword);

// Change Password : PUT /api/v1/change-password
router
    .route('/change-password')
    .put(AuthMiddleware.checkAuth, ValidationMiddleware.validateRequest(schemas.changePasswordSchema), AuthController.changePassword);

export default router;

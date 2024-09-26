import { Router } from 'express';
import { AuthController } from '../../controllers';
import { AuthMiddleware, ValidateRequestMiddleware } from '../../middlewares';
import { loginSchema, registerSchema } from '../../schemas';
import { forgotPasswordSchema } from '../../schemas/auth-schema';

const router = Router();

// Register : POST /api/v1/register
router.route('/register').post(ValidateRequestMiddleware.validateRequest(registerSchema), AuthController.register);

// Account Confirmation : PUT /api/v1/confirmation/:token?code=
router.route('/confirmation/:token').put(AuthController.confirmation);

// Login : POST /api/v1/login
router.route('/login').post(ValidateRequestMiddleware.validateRequest(loginSchema), AuthController.login);

// Profile : GET /api/v1/profile
router.route('/profile').get(AuthMiddleware.checkAuth, AuthController.profile);

// Logout : PUT /api/v1/logout
router.route('/logout').put(AuthMiddleware.checkAuth, AuthController.logout);

// Refresh Token : POST /api/v1/refresh-token
router.route('/refresh-token').post(AuthController.refreshToken);

// Forgot Password : PUT /api/v1/forgot-password
router.route('/forgot-password').post(ValidateRequestMiddleware.validateRequest(forgotPasswordSchema), AuthController.forgotPassword);

export default router;

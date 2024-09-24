import { Router } from 'express';
import { AuthController } from '../../controllers';
import { ValidateRequestMiddleware } from '../../middlewares';
import { loginSchema, registerSchema } from '../../schemas';

const router = Router();

// Register : POST /api/v1/register
router.route('/register').post(ValidateRequestMiddleware.validateRequest(registerSchema), AuthController.register);

// Account Confirmation : PUT /api/v1/confirmation/:token?code=
router.route('/confirmation/:token').put(AuthController.confirmation);

// Login : POST /api/v1/login
router.route('/login').post(ValidateRequestMiddleware.validateRequest(loginSchema), AuthController.login);

export default router;

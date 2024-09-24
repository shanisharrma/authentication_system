import { Router } from 'express';
import { AuthController } from '../../controllers';
import { ValidateRequestMiddleware } from '../../middlewares';
import { registerSchema } from '../../schemas';

const router = Router();

router.route('/register').post(ValidateRequestMiddleware.validateRequest(registerSchema), AuthController.register);

router.route('/confirmation/:token').put(AuthController.confirmation);

export default router;

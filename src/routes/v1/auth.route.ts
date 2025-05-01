import express from 'express';

import validate from '../../middlewares/validate';
import authValidation from '../../validations/auth.validation';
import { authController } from '../../controllers';
import authJWT from '../../middlewares/auth';

const router = express.Router();

router.post('/register', validate(authValidation.registerSchema), authController.register);
router.post('/login', validate(authValidation.loginSchema), authController.login);
router.post('/logout', validate(authValidation.logoutSchema), authController.logout);
router.post(
  '/refresh-tokens',
  validate(authValidation.refreshTokenSchema),
  authController.refreshTokens,
);
router.post(
  '/forgot-password',
  validate(authValidation.forgotPasswordSchema),
  authController.forgotPassword,
);
router.post(
  '/reset-password',
  validate(authValidation.resetPasswordSchema),
  authController.resetPassword,
);
router.post('/send-verification-email', authJWT(), authController.sendVerificationEmail);
router.post(
  '/verify-email',
  validate(authValidation.verifyEmailSchema),
  authController.verifyEmail,
);

export default router;

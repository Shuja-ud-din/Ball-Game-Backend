import express, { Router } from 'express';

import { login } from '@/controllers/auth.controller';
import { requestValidator } from '@/middleware/requestValidator';
import { LoginSchema } from '@/validation/auth.validation';

export const authRouter: Router = (() => {
  const router = express.Router();

  router.post('/login', requestValidator(LoginSchema), login);

  return router;
})();

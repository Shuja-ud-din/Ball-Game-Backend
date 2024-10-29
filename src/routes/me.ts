import express, { Router } from 'express';

import { getMe } from '@/controllers/me.controller';
import { authentication } from '@/middleware/authentication';

export const meRouter = (() => {
  const router: Router = express.Router();

  router.get('/', authentication, getMe);

  return router;
})();

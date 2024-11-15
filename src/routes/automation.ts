import express, { Router } from 'express';

import { startAutomation } from '@/controllers/automation.controller';
import { authentication } from '@/middleware/authentication';

export const automationRouter: Router = (() => {
  const router = express.Router();

  router.get('/start', authentication, startAutomation);

  return router;
})();

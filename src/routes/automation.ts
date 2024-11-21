import express, { Router } from 'express';

import { getAutomationStatus, startAutomation, testAutomation } from '@/controllers/automation.controller';
import { authentication } from '@/middleware/authentication';

export const automationRouter: Router = (() => {
  const router = express.Router();

  router.post('/start', authentication, startAutomation);
  router.get('/status', authentication, getAutomationStatus);
  router.post('/test', authentication, testAutomation);

  return router;
})();

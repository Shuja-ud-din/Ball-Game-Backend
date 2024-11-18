import express, { Router } from 'express';

import { stopServer } from '@/controllers/private.controller';

export const privateRouter: Router = (() => {
  const router = express.Router();

  router.get('/stop-server', stopServer);

  return router;
})();

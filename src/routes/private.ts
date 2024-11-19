import express, { Router } from 'express';

import { flushDb, stopServer } from '@/controllers/private.controller';

export const privateRouter: Router = (() => {
  const router = express.Router();

  router.get('/stop-server', stopServer);
  router.get('/flush-db', flushDb);

  return router;
})();

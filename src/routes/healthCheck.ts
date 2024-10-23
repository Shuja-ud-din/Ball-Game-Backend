import express, { Request, Response, Router } from 'express';

import { APIResponse } from '@/utils/response';

export const healthCheckRouter: Router = (() => {
  const router = express.Router();

  router.get('/', (_req: Request, res: Response) => {
    return APIResponse.success(res, 'Server is UP and Running');
  });

  return router;
})();

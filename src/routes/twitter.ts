import express, { Router } from 'express';

import { getTwitterOAuth, twitterCallBack } from '@/controllers/twitter.controller';

export const twitterRouter: Router = (() => {
  const router = express.Router();

  router.get('/auth', getTwitterOAuth);

  router.get('/callback', twitterCallBack);

  return router;
})();

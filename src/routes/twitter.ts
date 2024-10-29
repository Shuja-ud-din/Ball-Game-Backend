import express, { Router } from 'express';

import { getTwitterOAuth, postComment, twitterCallBack } from '@/controllers/twitter.controller';
import { authentication } from '@/middleware/authentication';
import { requestValidator } from '@/middleware/requestValidator';
import { TwitterPostCommentValidation } from '@/validation/twitter.validation';

export const twitterRouter: Router = (() => {
  const router = express.Router();

  router.get('/auth', getTwitterOAuth);
  router.get('/callback', twitterCallBack);
  router.post('/comment', authentication, requestValidator(TwitterPostCommentValidation), postComment);
  router.get('/status', authentication, postComment);

  return router;
})();

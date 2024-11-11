import express, { Router } from 'express';

import {
  getTwitterAccounts,
  getTwitterOAuth,
  postComment,
  postTweet,
  twitterCallBack,
} from '@/controllers/twitter.controller';
import { authentication } from '@/middleware/authentication';
import { requestValidator } from '@/middleware/requestValidator';
import {
  TWitterGenerateUrlPayloadValidation,
  TwitterGetAccountsValidation,
  TwitterPostCommentValidation,
  TwitterPostTweetValidation,
} from '@/validation/twitter.validation';

export const twitterRouter: Router = (() => {
  const router = express.Router();

  router.get('/auth', requestValidator(TWitterGenerateUrlPayloadValidation), getTwitterOAuth);
  router.get('/callback', twitterCallBack);
  router.post('/comment', authentication, requestValidator(TwitterPostCommentValidation), postComment);
  router.post('/tweet', authentication, requestValidator(TwitterPostTweetValidation), postTweet);
  router.get('/accounts', authentication, requestValidator(TwitterGetAccountsValidation), getTwitterAccounts);

  return router;
})();

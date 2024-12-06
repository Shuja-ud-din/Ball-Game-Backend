import express, { Router } from 'express';

import {
  getTwitterAccount,
  getTwitterAccounts,
  getTwitterOAuth,
  postComment,
  postTweet,
  twitterCallBack,
  updateTwitterConfiguration,
} from '@/controllers/twitter.controller';
import { authentication } from '@/middleware/authentication';
import { requestValidator } from '@/middleware/requestValidator';
import {
  TwitterConfigurationValidation,
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
  router.get('/account', authentication, requestValidator(TwitterGetAccountsValidation), getTwitterAccount);
  router.get('/accounts', authentication, getTwitterAccounts);

  router.put(
    '/account/configuration',
    authentication,
    requestValidator(TwitterConfigurationValidation),
    updateTwitterConfiguration
  );
  return router;
})();

import express, { Router } from 'express';

import {
  addTwitterConfiguration,
  editTwitterConfiguration,
  getTwitterAccount,
  getTwitterAccounts,
  getTwitterOAuth,
  postComment,
  postTweet,
  twitterCallBack,
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
  router.post(
    '/add-configuration',
    authentication,
    requestValidator(TwitterConfigurationValidation),
    addTwitterConfiguration
  );

  router.put(
    '/edit-configuration',
    authentication,
    requestValidator(TwitterConfigurationValidation),
    editTwitterConfiguration
  );
  return router;
})();

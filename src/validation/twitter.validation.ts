import Joi from 'joi';

import { AccountType } from '@/constants/enums';

export const TWitterGenerateUrlPayloadValidation = Joi.object({
  account: Joi.string()
    .valid(...Object.values(AccountType))
    .required(),
  token: Joi.string().required(),
});

export const TwitterPostCommentValidation = Joi.object({
  comment: Joi.string().required(),
  tweetId: Joi.string().required(),
  accountType: Joi.string().valid(...Object.values(AccountType)),
});

export const TwitterPostTweetValidation = Joi.object({
  tweet: Joi.string().required(),
});

export const TwitterGetAccountsValidation = Joi.object({
  accountTypes: Joi.array()
    .items(Joi.string().valid(...Object.values(AccountType)))
    .required(),
});

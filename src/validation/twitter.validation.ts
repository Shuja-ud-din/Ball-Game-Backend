import { AccountType } from '@prisma/client';
import Joi from 'joi';

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
  accountType: Joi.string().valid(...Object.values(AccountType)),
});

export const TwitterConfigurationValidation = Joi.object({
  accountType: Joi.string().valid(...Object.values(AccountType)),
  configuration: Joi.string().required(),
});

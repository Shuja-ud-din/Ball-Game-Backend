import Joi from 'joi';

export const TwitterPostCommentValidation = Joi.object({
  comment: Joi.string().required(),
  tweetId: Joi.string().required(),
});

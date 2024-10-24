import joi from 'joi';

export const LoginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

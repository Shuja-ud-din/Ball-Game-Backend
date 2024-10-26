import Joi from 'joi';

import { UserRoles, UserStatus } from '@/constants/enums';

export const CreateUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string()
    .valid(...Object.values(UserRoles))
    .optional(),
  status: Joi.string()
    .valid(...Object.values(UserStatus))
    .optional(),
});

export const UpdateUserSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  role: Joi.string()
    .valid(...Object.values(UserRoles))
    .optional(),
  status: Joi.string()
    .valid(...Object.values(UserStatus))
    .optional(),
});

export const GetUserSchema = Joi.object({
  id: Joi.string().required(),
});

export const DeleteUserSchema = Joi.object({
  id: Joi.string().required(),
});

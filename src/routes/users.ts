import express, { Router } from 'express';

import * as userController from '@/controllers/users.controller';
import { authentication } from '@/middleware/authentication';
import { requestValidator } from '@/middleware/requestValidator';
import { CreateUserSchema, DeleteUserSchema, GetUserSchema, UpdateUserSchema } from '@/validation/users.validation';

export const userRouter: Router = (() => {
  const router = express.Router();

  router.post('/', authentication, requestValidator(CreateUserSchema), userController.createUser);
  router.get('/:id', authentication, requestValidator(GetUserSchema), userController.getUserById);
  router.get('/', authentication, userController.getUsers);
  router.put('/', authentication, requestValidator(UpdateUserSchema), userController.updateUser);
  router.delete('/:id', authentication, requestValidator(DeleteUserSchema), userController.deleteUser);
  router.patch('/block/:id', authentication, requestValidator(GetUserSchema), userController.blockUser);
  router.patch('/activate/:id', authentication, requestValidator(GetUserSchema), userController.activateUser);

  return router;
})();

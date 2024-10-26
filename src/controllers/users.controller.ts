import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { UserStatus } from '@/constants/enums';
import { APIResponse } from '@/utils/response';

import * as userService from '../services/users.service';

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);

    return APIResponse.success(res, 'User created successfully', { user }, StatusCodes.CREATED);
  } catch (error: any) {
    return APIResponse.error(res, error.message, error.status);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    return APIResponse.success(res, 'User found', { user });
  } catch (error: any) {
    return APIResponse.error(res, error.message, error.status);
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await userService.getUsers();

    return APIResponse.success(res, 'Users found', { users });
  } catch (error: any) {
    return APIResponse.error(res, error.message, error.status);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const user = await userService.updateUser(id, req.body);

    return APIResponse.success(res, 'User updated successfully', { user });
  } catch (error: any) {
    return APIResponse.error(res, error.message, error.status);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);

    return APIResponse.success(res, 'User deleted successfully');
  } catch (error: any) {
    return APIResponse.error(res, error.message, error.status);
  }
};

export const blockUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await userService.updateUser(id, { status: UserStatus.BLOCKED });

    return APIResponse.success(res, 'User blocked successfully');
  } catch (error: any) {
    return APIResponse.error(res, error.message, error.status);
  }
};

export const activateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await userService.updateUser(id, { status: UserStatus.ACTIVE });

    return APIResponse.success(res, 'User activated successfully');
  } catch (error: any) {
    return APIResponse.error(res, error.message, error.status);
  }
};

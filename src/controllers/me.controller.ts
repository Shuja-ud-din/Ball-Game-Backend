import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { APIResponse } from '@/utils/response';

import * as meService from '../services/me.service';

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const user = await meService.getUserById(userId);

    if (!user) {
      return APIResponse.error(res, 'User not found', null, StatusCodes.NOT_FOUND);
    }

    return APIResponse.success(res, 'User found', { user });
  } catch (error: any) {
    return APIResponse.error(
      res,
      error?.message || 'Something went wrong',
      error,
      error?.status || StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

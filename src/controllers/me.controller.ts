import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { APIResponse } from '@/utils/response';

import * as meService from '../services/me.service';

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;

    const user = await meService.getUserById(userId);

    return APIResponse.success(res, 'User found', { user });
  } catch (error: any) {
    return APIResponse.error(
      res,
      error?.message || 'Somethig went wrong',
      error,
      error?.status || StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

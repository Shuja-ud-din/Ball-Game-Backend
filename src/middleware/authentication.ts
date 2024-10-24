import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { verifyToken } from '@/services/auth.service';
import { IDecodedToken } from '@/types/user.types';
import { APIResponse } from '@/utils/response';

export const authentication = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new Error('Unauthorized');
    }

    const user = verifyToken(token);

    req.user = user as IDecodedToken;

    next();
  } catch (error: any) {
    return APIResponse.error(res, error?.message || 'Unauthorized', error, StatusCodes.UNAUTHORIZED);
  }
};

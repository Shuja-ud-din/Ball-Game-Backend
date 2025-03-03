import { UserStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { generateToken } from '@/services/auth.service';
import { prismaClient } from '@/utils/db';
import { APIResponse } from '@/utils/response';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return APIResponse.error(res, 'User not found', null, StatusCodes.NOT_FOUND);
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return APIResponse.error(res, 'Invalid password', null, StatusCodes.UNAUTHORIZED);
    }

    if (user.status === UserStatus.BLOCKED) {
      return APIResponse.error(res, 'Your account is Blocked by Admin.', null, StatusCodes.UNAUTHORIZED);
    }

    if (user.status !== UserStatus.ACTIVE) {
      return APIResponse.error(res, 'Account not verified', null, StatusCodes.UNAUTHORIZED);
    }

    const token = generateToken(user);

    const resUser = {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    return APIResponse.success(res, 'Logged in successfully', { token, user: resUser });
  } catch (error: any) {
    return APIResponse.error(
      res,
      error?.message || 'Somethig went wrong',
      error,
      error?.status || StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

import { StatusCodes } from 'http-status-codes';

import { IUser, TGetUserService } from '@/types/user.types';
import { APIError } from '@/utils/APIError';
import { prismaClient } from '@/utils/db';

export const getUserById: TGetUserService = async (id) => {
  const user = await prismaClient.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new APIError('User not found', StatusCodes.NOT_FOUND);
  }

  const userReturn: IUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return userReturn;
};

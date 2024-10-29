import { StatusCodes } from 'http-status-codes';

import { User } from '@/models/user.model';
import { IUser, TGetUserService } from '@/types/user.types';
import { APIError } from '@/utils/APIError';

export const getUserById: TGetUserService = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    throw new APIError('User not found', StatusCodes.NOT_FOUND);
  }

  const userReturn: IUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return userReturn;
};

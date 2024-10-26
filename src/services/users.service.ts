import { StatusCodes } from 'http-status-codes';

import { User } from '@/models/user.model';
import { IUser, TCreateUserService, TGetUserService, TGetUsersService, TUpdateUserService } from '@/types/user.types';
import { APIError } from '@/utils/APIError';

import { hashPassword } from './auth.service';

export const createUser: TCreateUserService = async (user) => {
  const { email } = user;
  const existingEmail = await User.findOne({ email });

  if (existingEmail) {
    throw new APIError('Email already exists', StatusCodes.CONFLICT);
  }

  const hashedPassword = await hashPassword(user.password);
  user.password = hashedPassword;

  const newUser = await User.create(user);

  const userReturn: IUser = {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    status: newUser.status,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  };

  return userReturn;
};

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

export const getUsers: TGetUsersService = async () => {
  const users = await User.find();

  const usersList = users.map((user) => {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  });

  return usersList;
};

export const updateUser: TUpdateUserService = async (id, user) => {
  const existingUser = await User.findById(id);

  if (!existingUser) {
    throw new APIError('User not found', StatusCodes.NOT_FOUND);
  }

  if (user.email) {
    const existingEmail = await User.findOne({ email: user.email });

    if (existingEmail) {
      throw new APIError('Email already exists', StatusCodes.CONFLICT);
    }
  }

  const updatedUser = await User.findByIdAndUpdate(id, user);

  if (!updatedUser) {
    throw new APIError('User not found', StatusCodes.NOT_FOUND);
  }

  const userReturn: IUser = {
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    status: updatedUser.status,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
  };

  return userReturn;
};

export const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new APIError('User not found', StatusCodes.NOT_FOUND);
  }

  return user;
};

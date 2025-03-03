import { UserRole } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { IUser, TCreateUserService, TGetUserService, TGetUsersService, TUpdateUserService } from '@/types/user.types';
import { APIError } from '@/utils/APIError';
import { prismaClient } from '@/utils/db';

import { hashPassword } from './auth.service';

export const createUser: TCreateUserService = async (user) => {
  const { email } = user;
  const existingEmail = await prismaClient.user.findUnique({
    where: {
      email,
    },
  });

  if (existingEmail) {
    throw new APIError('Email already exists', StatusCodes.CONFLICT);
  }

  const hashedPassword = await hashPassword(user.password);
  user.password = hashedPassword;

  const newUser = await prismaClient.user.create({
    data: user,
  });

  const userReturn: IUser = {
    id: newUser.id,
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

export const getUsers: TGetUsersService = async () => {
  const users = await prismaClient.user.findMany();

  const usersList = users.map((user) => {
    return {
      id: user.id,
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
  const existingUser = await prismaClient.user.findUnique({
    where: {
      id,
    },
  });

  if (!existingUser) {
    throw new APIError('User not found', StatusCodes.NOT_FOUND);
  }

  if (existingUser.role === UserRole.SUPERADMIN) {
    throw new APIError('Cannot update superadmin', StatusCodes.FORBIDDEN);
  }

  if (user.email) {
    const existingEmail = await prismaClient.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (existingEmail) {
      throw new APIError('Email already exists', StatusCodes.CONFLICT);
    }
  }

  const updatedUser = await prismaClient.user.update({
    where: {
      id,
    },
    data: user,
  });

  if (!updatedUser) {
    throw new APIError('User not found', StatusCodes.NOT_FOUND);
  }

  const userReturn: IUser = {
    id: updatedUser.id,
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
  const user = await prismaClient.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new APIError('User not found', StatusCodes.NOT_FOUND);
  }

  if (user.role === UserRole.SUPERADMIN) {
    throw new APIError('Cannot delete superadmin', StatusCodes.FORBIDDEN);
  }

  await prismaClient.user.delete({
    where: {
      id,
    },
  });

  return user;
};

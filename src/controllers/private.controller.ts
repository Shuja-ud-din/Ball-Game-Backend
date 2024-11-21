import { Request, Response } from 'express';
import mongoose, { UpdateQuery } from 'mongoose';

import { UserStatus } from '@/constants/enums';
import { User } from '@/models/user.model';
import { userData } from '@/seeders/users/userData';
import { hashPassword } from '@/services/auth.service';
import { IUserDoc } from '@/types/user.types';
import redisClient from '@/utils/redis';
import { APIResponse } from '@/utils/response';

export const stopServer = (_req: Request, res: Response) => {
  APIResponse.success(res, 'Server is stopping');
  process.exit(0);
};

export const flushDb = async (_req: Request, res: Response) => {
  const { db } = mongoose.connection;

  if (!db) {
    return APIResponse.error;
  }

  const collections = await db.listCollections().toArray();

  const promises = collections.map(async (collection) => await db.collection(collection.name).drop());

  await Promise.all(promises);

  await Promise.all(
    userData.map(async (user: UpdateQuery<IUserDoc>) =>
      User.findOneAndUpdate(
        { email: user.email },
        {
          ...user,
          password: await hashPassword(user.password),
          status: UserStatus.ACTIVE,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    )
  );

  return APIResponse.success(res, 'DB Flushed Successfully');
};

export const flushRedis = async (_req: Request, res: Response) => {
  try {
    redisClient.flushAll();
    return APIResponse.success(res, 'Redis Flushed Successfully');
  } catch (error: any) {
    return APIResponse.error(res, error.message);
  }
};

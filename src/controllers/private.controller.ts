import { UserStatus } from '@prisma/client';
import { Request, Response } from 'express';

import { userData } from '@/seeders/users/userData';
import { hashPassword } from '@/services/auth.service';
import { prismaClient } from '@/utils/db';
import redisClient from '@/utils/redis';
import { APIResponse } from '@/utils/response';

export const stopServer = (_req: Request, res: Response) => {
  APIResponse.success(res, 'Server is stopping');
  process.exit(0);
};

export const flushDb = async (_req: Request, res: Response) => {
  const connection = prismaClient.$connect; // or appropriate connection reference if needed

  if (!connection) {
    return APIResponse.error(res, 'Database connection not found');
  }

  await prismaClient.$transaction([prismaClient.twitter.deleteMany(), prismaClient.user.deleteMany()]);

  await Promise.all(
    userData.map(async (user) => {
      await prismaClient.user.upsert({
        where: { email: user.email },
        update: {
          ...user,
          password: await hashPassword(user.password),
          status: UserStatus.ACTIVE,
        },
        create: {
          email: user.email,
          name: user.name,
          password: await hashPassword(user.password),
          role: user.role,
          status: UserStatus.ACTIVE,
        },
      });
    })
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

import { UserStatus } from '@prisma/client';
import { UpdateQuery } from 'mongoose';

import { hashPassword } from '@/services/auth.service';
import { IUserDoc } from '@/types/user.types';
import { prismaClient } from '@/utils/db';

import { userData } from './userData';

export const seedUsers = async () => {
  try {
    console.log('Seeding users...');

    await Promise.all(
      userData.map(
        async (user: UpdateQuery<IUserDoc>) =>
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
          })
      )
    );

    console.log('Users seeded!');
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong while seeding users');
  }
};

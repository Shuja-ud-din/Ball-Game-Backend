import { UpdateQuery } from 'mongoose';

import { UserStatus } from '@/constants/enums';
import { User } from '@/models/user.model';
import { hashPassword } from '@/services/auth.service';
import { IUser } from '@/types/user.types';

import { userData } from './userData';

export const seedUsers = async () => {
  try {
    console.log('Seeding users...');

    await Promise.all(
      userData.map(async (user: UpdateQuery<IUser>) =>
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

    console.log('Users seeded!');
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong while seeding users');
  }
};

import { prismaClient } from '@/utils/db';

import { seedUsers } from './users/users';

const seedDatabase = async () => {
  prismaClient
    .$connect()
    .then(async () => {
      console.log('Connected to the database');
      await seedUsers();
      process.exit(0);
    })
    .catch((err) => {
      console.log('Something went wrong while seeding'), JSON.stringify(err);
    })
    .finally(() => {
      prismaClient.$disconnect();
    });
};

seedDatabase();

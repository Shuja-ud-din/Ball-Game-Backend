import mongoose from 'mongoose';

import { env } from '@/config/env';

import { seedUsers } from './users/users';

const { MONGO_URL } = env;

const seedDatabase = async () => {
  mongoose
    .connect(MONGO_URL)
    .then(async () => {
      console.log('Connected to Mongo DB');
      await seedUsers();
      // await seedPlans();
      // await seedSubscriptions();
    })
    .catch((err) => {
      console.log('Something went wrong while seeding'), JSON.stringify(err);
    })
    .finally(() => {
      mongoose.connection.close();
    });
};

seedDatabase();

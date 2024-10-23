import mongoose from 'mongoose';

import { env } from '@/config/env';
import { logger } from '@/server';

const { MONGO_URL } = env;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    logger.info('Connected to Mongo DB');
  })
  .catch((err) => {
    console.error(err);
  });

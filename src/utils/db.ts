import { PrismaClient } from '@prisma/client';

import { logger } from '@/server';

const prismaClient = new PrismaClient();

prismaClient
  .$connect()
  .then(() => {
    logger.info('PostgreSQL connected successfully');
  })
  .catch((error) => {
    logger.error('PostgreSQL connection failed:');
    console.error(error);
    process.exit(1);
  });

export { prismaClient };

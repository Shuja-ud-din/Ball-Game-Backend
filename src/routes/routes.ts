import express from 'express';

import { apiRoutes } from '@/constants/apiRoutes';

import { authRouter } from './auth';
import { healthCheckRouter } from './healthCheck';
import { twitterRouter } from './twitter';
import { userRouter } from './users';

const router = express.Router();

router.use(apiRoutes.healthCheck, healthCheckRouter);
router.use(apiRoutes.auth, authRouter);
router.use(apiRoutes.twitter, twitterRouter);
router.use(apiRoutes.users, userRouter);

export default router;

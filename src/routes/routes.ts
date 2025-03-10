import express from 'express';

import { apiRoutes } from '@/constants/apiRoutes';

import { authRouter } from './auth';
import { automationRouter } from './automation';
import { gamesRouter } from './games';
import { healthCheckRouter } from './healthCheck';
import { meRouter } from './me';
import { privateRouter } from './private';
import { twitterRouter } from './twitter';
import { userRouter } from './users';

const router = express.Router();

router.use(apiRoutes.healthCheck, healthCheckRouter);
router.use(apiRoutes.auth, authRouter);
router.use(apiRoutes.twitter, twitterRouter);
router.use(apiRoutes.users, userRouter);
router.use(apiRoutes.me, meRouter);
router.use(apiRoutes.games, gamesRouter);
router.use(apiRoutes.automation, automationRouter);
router.use(apiRoutes.private, privateRouter);

export default router;

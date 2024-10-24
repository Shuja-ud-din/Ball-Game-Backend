import express from 'express';

import { apiRoutes } from '@/constants/apiRoutes';

import { authRouter } from './auth';
import { healthCheckRouter } from './healthCheck';

const router = express.Router();

router.use(apiRoutes.healthCheck, healthCheckRouter);
router.use(apiRoutes.auth, authRouter);

export default router;

import express from 'express';

import { apiRoutes } from '@/constants/apiRoutes';

import { healthCheckRouter } from './healthCheck';

const router = express.Router();

router.use(apiRoutes.healthCheck, healthCheckRouter);

export default router;

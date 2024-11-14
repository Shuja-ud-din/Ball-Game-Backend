import express, { Router } from 'express';

import { getGames } from '@/controllers/games.controller';
import { authentication } from '@/middleware/authentication';

export const gamesRouter: Router = (() => {
  const router = express.Router();

  router.get('/', authentication, getGames);

  return router;
})();

import { Request, Response } from 'express';

import { getGamesOfTheDay } from '@/services/games.service';
import { APIResponse } from '@/utils/response';

export const getGames = async (_req: Request, res: Response) => {
  try {
    const games = await getGamesOfTheDay();

    const gamesData = games.games.map((game) => {
      return {
        homeTeam: game.home,
        awayTeam: game.away,
        scheduled: game.scheduled,
        venue: game.venue,
      };
    });

    return APIResponse.success(res, 'Games of the day', { games: gamesData });
  } catch (error: any) {
    return APIResponse.error(res, error.message);
  }
};

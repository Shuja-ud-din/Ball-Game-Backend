import { Request, Response } from 'express';
import schedule from 'node-schedule';

import { generateAndPostTweet } from '@/services/automation.service';
import { getGamesOfTheDay } from '@/services/games.service';
import redisClient from '@/utils/redis';
import { APIResponse } from '@/utils/response';

export const startAutomation = async (_req: Request, res: Response) => {
  try {
    const todayGames = await getGamesOfTheDay();

    if (!todayGames.games.length) {
      return APIResponse.error(res, 'No games today');
    }

    // start
    todayGames.games.forEach((game) => {
      const { scheduled } = game;
      const tweetPostTime = new Date(scheduled).getTime() - 3600000; // 1 hour before the game

      if (tweetPostTime > Date.now()) {
        schedule.scheduleJob(tweetPostTime, async () => {
          await generateAndPostTweet(game);
        });
      }
    });

    // set automation status in redis
    redisClient.set('automationStatus', 'running', {
      EX: 86400, // 1 day
    });

    return APIResponse.success(res, 'Automation started successfully');
  } catch (error: any) {
    console.log({ error: error });

    return APIResponse.error(res, error.message);
  }
};

export const getAutomationStatus = async (_req: Request, res: Response) => {
  try {
    const status = await redisClient.get('automationStatus');

    return APIResponse.success(res, 'Automation status', { status });
  } catch (error: any) {
    console.log({ error: error });

    return APIResponse.error(res, error.message);
  }
};

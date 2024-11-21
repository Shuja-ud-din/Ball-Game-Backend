import { Request, Response } from 'express';
import schedule from 'node-schedule';

import { generateAndPostTweet } from '@/services/automation.service';
import { getGamesOfTheDay } from '@/services/games.service';
import { IGame } from '@/types/games.types';
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

export const testAutomation = async (_req: Request, res: Response) => {
  try {
    const game: IGame = {
      home: {
        name: 'Washington Wizards',
        alias: 'WAS',
        id: '583ec8d4-fb46-11e1-82cb-f4ce4684ea4c',
        sr_id: 'sr:team:3431',
        reference: '1610612764',
      },
      away: {
        name: 'Boston Celtics',
        alias: 'BOS',
        id: '583eccfa-fb46-11e1-82cb-f4ce4684ea4c',
        sr_id: 'sr:team:3422',
        reference: '1610612738',
      },
      scheduled: '2024-11-22T02:15:00Z',
      venue: {
        id: 'f62d5b49-d646-56e9-ba60-a875a00830f8',
        name: 'Capital One Arena',
        capacity: 20356,
        address: '601 F Street NW',
        city: 'Washington',
        state: 'DC',
        zip: '20004',
        country: 'USA',
        sr_id: 'sr:venue:6016',
        location: {
          lat: '38.898056',
          lng: '-77.020833',
        },
      },
    };

    await generateAndPostTweet(game);

    return APIResponse.success(res, 'Automation test successful');
  } catch (error: any) {
    console.log({ error: error });

    return APIResponse.error(res, error.message);
  }
};

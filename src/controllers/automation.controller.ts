import dayjs from 'dayjs';
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
    todayGames.games.forEach((game, index) => {
      const { scheduled, home, away } = game;
      const tweetPostTime = new Date(scheduled).getTime() - 3600000 + index * 60000; // 1 hour before the game + staggered by index

      console.log(
        `Game #${index + 1} Tweet post time: ${dayjs(scheduled).format('MMMM D, YYYY h:mm A')} (${home.name} vs. ${away.name})`
      );

      if (tweetPostTime < Date.now()) {
        console.log('Game already started');
      } else {
        schedule.scheduleJob(tweetPostTime, async () => {
          try {
            console.log(`Posting tweet for Game #${index + 1}: ${home.name} vs. ${away.name}`);

            await generateAndPostTweet(game);
          } catch (e: any) {
            console.error(`Error posting tweet for Game #${index + 1}:`, e.message);
          }
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
  const now = new Date(); // Current date and time
  const updatedTime = new Date(now.getTime() + 1 * 60 * 60 * 1000 + 1 * 60 * 1000);
  try {
    const games: IGame[] = [
      {
        home: {
          name: 'Utah Jazz',
          alias: 'UTA',
          id: '583ece50-fb46-11e1-82cb-f4ce4684ea4c',
          sr_id: 'sr:team:3434',
          reference: '1610612762',
        },
        away: {
          name: 'New York Knicks',
          alias: 'NYK',
          id: '583ec70e-fb46-11e1-82cb-f4ce4684ea4c',
          sr_id: 'sr:team:3421',
          reference: '1610612752',
        },
        scheduled: updatedTime.toISOString(),
        venue: {
          id: '53bac75a-a667-52b5-a416-b80718ae4ed2',
          name: 'Delta Center',
          capacity: 18206,
          address: '301 South Temple Street',
          city: 'Salt Lake City',
          state: 'UT',
          zip: '84101',
          country: 'USA',
          sr_id: 'sr:venue:6944',
          location: {
            lat: '40.768273',
            lng: '-111.901141',
          },
        },
      },
      {
        home: {
          name: 'Orlando Magic',
          alias: 'ORL',
          id: '583ed157-fb46-11e1-82cb-f4ce4684ea4c',
          sr_id: 'sr:team:3437',
          reference: '1610612753',
        },
        away: {
          name: 'Detroit Pistons',
          alias: 'DET',
          id: '583ec928-fb46-11e1-82cb-f4ce4684ea4c',
          sr_id: 'sr:team:3424',
          reference: '1610612765',
        },
        scheduled: updatedTime.toISOString(),
        venue: {
          id: 'aecd8da6-0404-599c-a792-4b33fb084a2a',
          name: 'Kia Center',
          capacity: 18846,
          address: '400 W. Church Street',
          city: 'Orlando',
          state: 'FL',
          zip: '32801',
          country: 'USA',
          sr_id: 'sr:venue:6936',
          location: {
            lat: '28.539167',
            lng: '-81.383611',
          },
        },
      },
    ];

    games.forEach((game, index) => {
      const { scheduled, home, away } = game;
      const tweetPostTime = new Date(scheduled).getTime() - 3600000 + index * 60000; // 1 hour before the game + staggered by index

      console.log(
        `Game #${index + 1} Tweet post time: ${dayjs(scheduled).format('MMMM D, YYYY h:mm A')} (${home.name} vs. ${away.name})`
      );

      if (tweetPostTime < Date.now()) {
        console.log('Game already started');
      } else {
        schedule.scheduleJob(tweetPostTime, async () => {
          try {
            console.log(`Posting tweet for Game #${index + 1}: ${home.name} vs. ${away.name}`);

            await generateAndPostTweet(game);
          } catch (e: any) {
            console.error(`Error posting tweet for Game #${index + 1}:`, e.message);
          }
        });
      }
    });

    return APIResponse.success(res, 'Automation test successful');
  } catch (error: any) {
    console.log({ error: error });

    return APIResponse.error(res, error.message);
  }
};

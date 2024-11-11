import axios from 'axios';

import { env } from '@/config/env';
import { IGetGamesOfTheDayResponse, TGetGamesOfTheDay } from '@/types/games.types';
import redisClient from '@/utils/redis';

const { SPORTRADER_API_KEY } = env;

const NBAApi = axios.create({
  baseURL: 'https://api.sportradar.com/nba/trial/v8/en',
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    api_key: SPORTRADER_API_KEY,
  },
});

export const getGamesOfTheDay: TGetGamesOfTheDay = async () => {
  const cacheKey = 'gamesOfTheDay';

  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData) as IGetGamesOfTheDayResponse;
  }

  const date = new Date();
  const { data } = await NBAApi.get<IGetGamesOfTheDayResponse>(
    `/games/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/schedule.json`
  );

  const expiry = 60 * 60 * 24; // 24 hours
  redisClient.setEx(cacheKey, expiry, JSON.stringify(data));

  return data;
};

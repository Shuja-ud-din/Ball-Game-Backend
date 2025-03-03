import { AccountType } from '@prisma/client';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { env } from '@/config/env';
import { AIPersonality } from '@/constants/enums';
import { generateComment, generateTweet } from '@/services/ai.service';
import { verifyToken } from '@/services/auth.service';
import { getGamesOfTheDay } from '@/services/games.service';
import {
  generateTwitterOAuthUrl,
  getTwitterAccountByType,
  postTwitterComment,
  postTwitterTweet,
  twitterLogin,
  updateConfiguration,
} from '@/services/twitter.service';
import { IAIResponse } from '@/types/ai.types';
import { IDecodedToken } from '@/types/user.types';
import { prismaClient } from '@/utils/db';
import { APIResponse } from '@/utils/response';

export const getTwitterOAuth = async (req: Request, res: Response) => {
  try {
    const { account, token } = req.query;

    const user = verifyToken(token as string);
    req.user = user as IDecodedToken;

    const {
      url,
      codeVerifier: verifier,
      state,
    } = await generateTwitterOAuthUrl({
      state: account as string,
    });

    req.session['codeVerifier'] = verifier;
    req.session['state'] = state;

    res.redirect(url);
  } catch (error: any) {
    console.log({ error: error });

    return APIResponse.error(
      res,
      error?.message || 'Somethig went wrong',
      error,
      error?.status || StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const twitterCallBack = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    const { codeVerifier, state } = req.session;

    if (!codeVerifier || !code || !state) {
      return APIResponse.error(res, 'Invalid request', null, StatusCodes.BAD_REQUEST);
    }

    const response = await twitterLogin({ code: code as string, codeVerifier: codeVerifier as string });
    req.session.codeVerifier = '';

    const twitterToken = await prismaClient.twitter.findFirst({
      where: {
        accountType: state as AccountType,
      },
    });

    if (twitterToken) {
      await prismaClient.twitter.update({
        where: {
          id: twitterToken.id,
        },
        data: {
          id: response.id,
          name: response.name,
          username: response.username,
          accountType: state as AccountType,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          expiryDate: response.expiryDate,
        },
      });
    } else {
      await prismaClient.twitter.create({
        data: {
          id: response.id,
          name: response.name,
          username: response.username,
          accountType: state as AccountType,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          expiryDate: response.expiryDate,
        },
      });
    }

    res.redirect(`${env.FRONTEND_URL}/dashboard/settings`);
  } catch (error: any) {
    console.log({ error: error });

    return APIResponse.error(
      res,
      error?.message || 'Somethig went wrong',
      error,
      error?.status || StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const postComment = async (req: Request, res: Response) => {
  try {
    const { comment, tweetId, accountType } = req.body;

    await postTwitterComment(comment, tweetId, accountType);

    return APIResponse.success(res, 'Comment posted successfully');
  } catch (error: any) {
    console.log({ error: error });

    return APIResponse.error(
      res,
      error?.message || 'Somethig went wrong',
      error,
      error?.status || StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const postTweet = async (req: Request, res: Response) => {
  try {
    const { tweet } = req.body;

    await postTwitterTweet(tweet);

    return APIResponse.success(res, 'Tweet posted successfully');
  } catch (error: any) {
    console.log({ error: error });

    return APIResponse.error(
      res,
      error?.message || 'Somethig went wrong',
      error,
      error?.status || StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const getTwitterAccount = async (req: Request, res: Response) => {
  try {
    const { accountType } = req.query;

    const account = await getTwitterAccountByType(accountType as AccountType);

    return APIResponse.success(res, 'Accounts fetched successfully', { account });
  } catch (error: any) {
    console.log({ error: error });

    return APIResponse.error(
      res,
      error?.message || 'Somethig went wrong',
      error,
      error?.status || StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const getTwitterAccounts = async (_req: Request, res: Response) => {
  try {
    const accounts = await prismaClient.twitter.findMany();

    const accountsRes = accounts.map((account) => {
      return {
        id: account.id,
        name: account.name,
        username: account.username,
        accountType: account.accountType,
      };
    });

    return APIResponse.success(res, 'Accounts fetched successfully', { accounts: accountsRes });
  } catch (error: any) {
    console.log({ error: error });

    return APIResponse.error(
      res,
      error?.message || 'Somethig went wrong',
      error,
      error?.status || StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const updateTwitterConfiguration = async (req: Request, res: Response) => {
  try {
    const { accountType, configuration } = req.body;

    await updateConfiguration(accountType, configuration);

    return APIResponse.success(res, 'Configuration updated successfully');
  } catch (error: any) {
    console.log({ error: error });

    return APIResponse.error(
      res,
      error?.message || 'Something went wrong',
      error,
      error?.status || StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const testAiResponses = async (req: Request, res: Response) => {
  try {
    const { games } = await getGamesOfTheDay();

    const responses: IAIResponse[] = [];

    for (const game of games) {
      const tweet = await generateTweet(game);

      const comments: IAIResponse['comments'] = [];

      for (let i = 0; i < 4; i++) {
        const response = await generateComment(game, i % 2 === 0 ? AIPersonality.MIKE : AIPersonality.LARRY, tweet);
        comments.push({
          comment: response,
          personality: i % 2 === 0 ? AIPersonality.MIKE : AIPersonality.LARRY,
        });
      }

      responses.push({
        accountType: AccountType.MAIN,
        tweet,
        comments,
      });
    }

    return APIResponse.success(res, 'Responses Generated', { responses });
  } catch (error: any) {
    console.log({ error: error });

    return APIResponse.error(
      res,
      error?.message || 'Something went wrong',
      error,
      error?.status || StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

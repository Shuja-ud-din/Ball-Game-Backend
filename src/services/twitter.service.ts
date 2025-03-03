import { AccountType } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { TwitterApi } from 'twitter-api-v2';

import { env } from '@/config/env';
import {
  ITwitterAccount,
  TFindNBALatestTweet,
  TGenerateTwitterOAuthUrl,
  TGetTwitterAccountByType,
  TGetTwitterRefreshToken,
  TGetTwitterToken,
  TPostTwitterComment,
  TPostTwitterTweet,
  TTwitterLogin,
} from '@/types/twitter.types';
import { APIError } from '@/utils/APIError';
import { prismaClient } from '@/utils/db';

const TWITTER_REDIRECT_URI = env.TWITTER_REDIRECT_URI;
const CLIENT_ID = env.TWITTER_CLIENT_ID;
const TWITTER_CLIENT_SECRET = env.TWITTER_CLIENT_SECRET;
const TWITTER_API_KEY = env.TWITTER_API_KEY;
const TWITTER_API_SECRET = env.TWITTER_API_SECRET;
const SCOPES = ['tweet.read', 'tweet.write', 'users.read', 'offline.access'];

const twitterClient = new TwitterApi({
  clientId: CLIENT_ID,
  clientSecret: TWITTER_CLIENT_SECRET,
});

export const generateTwitterOAuthUrl: TGenerateTwitterOAuthUrl = async (payload) => {
  const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(TWITTER_REDIRECT_URI, {
    scope: SCOPES,
    state: payload?.state,
  });

  return { url, codeVerifier, state };
};

export const twitterLogin: TTwitterLogin = async ({ codeVerifier, code }) => {
  try {
    const {
      client: loggedClient,
      accessToken,
      refreshToken,
      expiresIn,
    } = await twitterClient.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: TWITTER_REDIRECT_URI,
    });

    const userDetails = await loggedClient.v2.me();

    const { id, name, username } = userDetails.data;

    return {
      id,
      name,
      username,
      accessToken,
      refreshToken: refreshToken as string,
      expiryDate: new Date(Date.now() + expiresIn * 1000),
    };
  } catch (error: any) {
    console.log({ error: error });

    throw new APIError(error.message || 'Error logging in with Twitter', StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

export const isTokenValid = async (accountType: AccountType): Promise<boolean> => {
  try {
    const twitterToken = await prismaClient.twitter.findFirst({
      where: {
        accountType,
      },
    });

    if (!twitterToken) {
      return false;
    }

    const twitterClient = new TwitterApi(twitterToken.accessToken);

    const { data } = await twitterClient.v2.me();

    console.log('Twitter user data:', data);
    return true;
  } catch (e) {
    return false;
  }
};

export const getTwitterRefreshToken: TGetTwitterRefreshToken = async (twitterRefreshToken) => {
  try {
    const {
      // client: refreshedClient,
      accessToken,
      refreshToken,
      expiresIn,
    } = await twitterClient.refreshOAuth2Token(twitterRefreshToken);

    return { accessToken, refreshToken: refreshToken as string, expiresIn };
  } catch (e: any) {
    console.log('Error in refreshing token:', e);
    throw new APIError(e.message || 'Error refreshing Twitter token', StatusCodes.INTERNAL_SERVER_ERROR, e);
  }
};

export const getTwitterToken: TGetTwitterToken = async (accountType = AccountType.MAIN) => {
  const twitterToken = await prismaClient.twitter.findFirst({
    where: {
      accountType,
    },
  });

  if (!twitterToken) {
    throw new APIError('Twitter token not found', StatusCodes.UNAUTHORIZED);
  }

  // refresh token if expired (1 day before expiry)
  if (twitterToken.expiryDate.getTime() - Date.now() < 86400000) {
    const refreshedToken = await getTwitterRefreshToken(twitterToken.refreshToken);

    await prismaClient.twitter.update({
      where: {
        id: twitterToken.id,
      },
      data: {
        accessToken: refreshedToken.accessToken,
        refreshToken: refreshedToken.refreshToken,
        expiryDate: new Date(Date.now() + refreshedToken.expiresIn * 1000),
      },
    });
  }

  return twitterToken;
};

export const postTwitterComment: TPostTwitterComment = async (comment, tweetId, accountType) => {
  const twitterToken = await getTwitterToken(accountType);

  console.log({ twitterToken, TWITTER_API_KEY, TWITTER_API_SECRET });

  const client = new TwitterApi(twitterToken.accessToken);

  const response = await client.v2.tweet({
    text: comment,
    reply: {
      in_reply_to_tweet_id: tweetId,
    },
  });

  return response;
};

export const postTwitterTweet: TPostTwitterTweet = async (tweet) => {
  const twitterToken = await getTwitterToken();

  const client = new TwitterApi(twitterToken.accessToken);

  const response = await client.v2.tweet({
    text: tweet,
  });

  return response;
};

export const getTwitterAccountByType: TGetTwitterAccountByType = async (accountType) => {
  const account = await prismaClient.twitter.findFirst({
    where: {
      accountType,
    },
  });

  if (!account) {
    throw new APIError('Twitter account not found', StatusCodes.NOT_FOUND);
  }

  const accountRes: ITwitterAccount = {
    id: account.id,
    name: account.name,
    username: account.username,
    accountType: account.accountType,
    configuration: account.configuration as string,
    expiryDate: account.expiryDate,
  };

  return accountRes;
};

export const findNBALatestTweet: TFindNBALatestTweet = async (match) => {
  const searchQuery = `${match.homeTeam} vs ${match.awayTeam} from:NBA`;

  const twitterToken = await getTwitterToken();
  const client = new TwitterApi(twitterToken.accessToken);

  const searchResults = await client.v2.search(searchQuery, { max_results: 5 });

  const nbaTweet = searchResults.data?.data?.[0];
  if (nbaTweet) {
    console.log(`Found NBA tweet for match : ${nbaTweet.id}`);
    return nbaTweet;
  }

  return null;
};

export const updateConfiguration = async (accountType: AccountType, configuration: string) => {
  const twitterToken = await prismaClient.twitter.findFirst({
    where: {
      accountType,
    },
  });

  if (!twitterToken) {
    throw new APIError('Twitter account not found', StatusCodes.NOT_FOUND);
  }

  twitterToken.configuration = configuration;

  await prismaClient.twitter.update({
    where: {
      id: twitterToken.id,
    },
    data: {
      configuration,
    },
  });

  return twitterToken;
};

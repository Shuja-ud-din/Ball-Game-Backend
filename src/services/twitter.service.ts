import { StatusCodes } from 'http-status-codes';
import { TwitterApi } from 'twitter-api-v2';

import { env } from '@/config/env';
import { Twitter } from '@/models/twitter.model';
import {
  ITwitterAccount,
  TGenerateTwitterOAuthUrl,
  TGetTwitterAccountsByTypes,
  TGetTwitterRefreshToken,
  TGetTwitterToken,
  TPostTwitterComment,
  TPostTwitterTweet,
  TTwitterLogin,
} from '@/types/twitter.types';
import { APIError } from '@/utils/APIError';

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
      expiresIn,
    };
  } catch (error: any) {
    console.log({ error: error });

    throw new APIError(error.message || 'Error logging in with Twitter', StatusCodes.INTERNAL_SERVER_ERROR, error);
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
    console.log('Error:', e);
    throw new APIError(e.message || 'Error refreshing Twitter token', StatusCodes.INTERNAL_SERVER_ERROR, e);
  }
};

export const getTwitterToken: TGetTwitterToken = async () => {
  const twitterToken = await Twitter.findOne().sort({ createdAt: -1 });

  if (!twitterToken) {
    throw new APIError('No Twitter token found', StatusCodes.NOT_FOUND);
  }

  return twitterToken;
};

export const postTwitterComment: TPostTwitterComment = async (comment, tweetId) => {
  const twitterToken = await getTwitterToken();

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

export const getTwitterAccountsByTypes: TGetTwitterAccountsByTypes = async (accountTypes) => {
  const accounts = await Twitter.find({ accountType: { $in: accountTypes } });

  const accountsList: ITwitterAccount[] = accounts.map((account) => {
    return {
      id: account.id,
      name: account.name,
      username: account.username,
      accountType: account.accountType,
    };
  });

  return accountsList;
};

import { StatusCodes } from 'http-status-codes';
import { TwitterApi } from 'twitter-api-v2';

import { env } from '@/config/env';
import { TGenerateTwitterOAuthUrl, TGetTwitterRefreshToken, TTwitterLogin } from '@/types/twitter.types';
import { APIError } from '@/utils/APIError';

const TWITTER_REDIRECT_URI = env.TWITTER_REDIRECT_URI;
const CLIENT_ID = env.TWITTER_CLIENT_ID;
const TWITTER_CLIENT_SECRET = env.TWITTER_CLIENT_SECRET;
const SCOPES = ['tweet.read', 'tweet.write', 'users.read', 'offline.access'];

const twitterClient = new TwitterApi({
  clientId: CLIENT_ID,
  clientSecret: TWITTER_CLIENT_SECRET,
});

export const generateTwitterOAuthUrl: TGenerateTwitterOAuthUrl = async () => {
  const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(TWITTER_REDIRECT_URI, {
    scope: SCOPES,
  });

  // twitterClient.v2.getActiveTokens()

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

    console.log({ accessToken, refreshToken, expiresIn, loggedClient });

    return {
      accessToken,
      refreshToken,
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

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { env } from '@/config/env';
import { AccountType } from '@/constants/enums';
import { Twitter } from '@/models/twitter.model';
import { verifyToken } from '@/services/auth.service';
import {
  generateTwitterOAuthUrl,
  getTwitterAccountsByTypes,
  postTwitterComment,
  postTwitterTweet,
  twitterLogin,
} from '@/services/twitter.service';
import { IDecodedToken } from '@/types/user.types';
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
  const { code } = req.query;
  const { codeVerifier, state } = req.session;

  if (!codeVerifier || !code || !state) {
    return APIResponse.error(res, 'Invalid request', null, StatusCodes.BAD_REQUEST);
  }

  const response = await twitterLogin({ code: code as string, codeVerifier: codeVerifier as string });
  req.session.codeVerifier = '';

  const twitterToken = await Twitter.findOne();
  if (twitterToken) {
    twitterToken.id = response.id;
    twitterToken.name = response.name;
    twitterToken.username = response.username;
    twitterToken.accountType = state as AccountType;
    twitterToken.accessToken = response.accessToken;
    twitterToken.refreshToken = response.refreshToken;
    twitterToken.expiresIn = response.expiresIn;
    await twitterToken.save();
  } else {
    await Twitter.create({
      id: response.id,
      name: response.name,
      username: response.username,
      accountType: state as AccountType,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      expiresIn: response.expiresIn,
    });
  }

  res.redirect(`${env.FRONTEND_URL}/dashboard/settings`);
};

export const postComment = async (req: Request, res: Response) => {
  try {
    const { comment, tweetId } = req.body;

    await postTwitterComment(comment, tweetId);

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

export const getTwitterAccounts = async (req: Request, res: Response) => {
  try {
    const { accountTypes } = req.query;

    const accounts = await getTwitterAccountsByTypes(accountTypes as AccountType[]);

    return APIResponse.success(res, 'Accounts fetched successfully', { accounts });
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

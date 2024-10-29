import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { env } from '@/config/env';
import { TwitterToken } from '@/models/twitter.model';
import { generateTwitterOAuthUrl, postTwitterComment, twitterLogin } from '@/services/twitter.service';
import { APIResponse } from '@/utils/response';

export const getTwitterOAuth = async (req: Request, res: Response) => {
  const { url, codeVerifier: verifier } = await generateTwitterOAuthUrl();

  req.session['codeVerifier'] = verifier;

  res.redirect(url);
};

export const twitterCallBack = async (req: Request, res: Response) => {
  const { code } = req.query;
  const { codeVerifier } = req.session;

  if (!codeVerifier || !code) {
    return res.status(StatusCodes.BAD_REQUEST).send('You denied the app or your session expired!');
  }

  const response = await twitterLogin({ code: code as string, codeVerifier: codeVerifier as string });
  req.session.codeVerifier = '';

  const twitterToken = await TwitterToken.findOne();
  if (twitterToken) {
    twitterToken.accessToken = response.accessToken;
    twitterToken.refreshToken = response.refreshToken;
    twitterToken.expiresIn = response.expiresIn;
    await twitterToken.save();
  } else {
    await TwitterToken.create({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      expiresIn: response.expiresIn,
    });
  }

  res.redirect(`${env.FRONTEND_URL}/dashboard`);
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

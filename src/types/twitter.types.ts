import { TweetV2, TweetV2PostTweetResult } from 'twitter-api-v2';

import { AccountType } from '@/constants/enums';

interface ITwitterLogin {
  codeVerifier: string;
  code: string;
}

export interface ITwitterOAuthUrl {
  url: string;
  codeVerifier: string;
  state: string;
}

export interface ITwitter {
  id: string;
  name: string;
  username: string;
  accountType: AccountType;
  configuration?: string;
  accessToken: string;
  refreshToken: string;
  expiryDate: Date;
}

export interface ITwitterLoginResponse {
  id: string;
  name: string;
  username: string;
  accessToken: string;
  refreshToken: string;
  expiryDate: Date;
}

export interface IGenerateUrlPayload {
  state?: string;
}

export interface ITwitterAccount {
  id: string;
  name: string;
  username: string;
  configuration: string;
  accountType: AccountType;
  expiryDate: Date;
}

export interface IFindNBALatestTweetPayload {
  homeTeam: string;
  awayTeam: string;
}

export type TTwitterLogin = (payload: ITwitterLogin) => Promise<ITwitterLoginResponse>;
export type TGenerateTwitterOAuthUrl = (payload?: IGenerateUrlPayload) => Promise<ITwitterOAuthUrl>;
export type TGetTwitterRefreshToken = (twitterRefreshToken: string) => Promise<ITwitter | any>;
export type TGetTwitterToken = (accountType?: AccountType) => Promise<ITwitter>;
export type TPostTwitterComment = (tweetId: string, comment: string, accountType: AccountType) => Promise<any>;
export type TPostTwitterTweet = (tweet: string) => Promise<TweetV2PostTweetResult>;
export type TGetTwitterAccountByType = (accountTypes: AccountType) => Promise<ITwitterAccount>;
export type TFindNBALatestTweet = (match: IFindNBALatestTweetPayload) => Promise<TweetV2 | null>;

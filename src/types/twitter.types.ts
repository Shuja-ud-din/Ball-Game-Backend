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
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ITwitterLoginResponse {
  id: string;
  name: string;
  username: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface IGenerateUrlPayload {
  state?: string;
}

export interface ITwitterAccount {
  id: string;
  name: string;
  username: string;
  accountType: AccountType;
}

export type TTwitterLogin = (payload: ITwitterLogin) => Promise<ITwitterLoginResponse>;
export type TGenerateTwitterOAuthUrl = (payload?: IGenerateUrlPayload) => Promise<ITwitterOAuthUrl>;
export type TGetTwitterRefreshToken = (twitterRefreshToken: string) => Promise<ITwitter | any>;
export type TGetTwitterToken = () => Promise<ITwitter>;
export type TPostTwitterComment = (tweetId: string, comment: string) => Promise<any>;
export type TPostTwitterTweet = (tweet: string) => Promise<any>;
export type TGetTwitterAccountsByTypes = (accountTypes: AccountType[]) => Promise<ITwitterAccount[]>;

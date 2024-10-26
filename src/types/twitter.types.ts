interface ITwitterLogin {
  codeVerifier: string;
  code: string;
}

export interface ITwitterOAuthUrl {
  url: string;
  codeVerifier: string;
  state: string;
}

export interface ITwitterToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export type TTwitterLogin = (payload: ITwitterLogin) => Promise<ITwitterToken | any>;
export type TGenerateTwitterOAuthUrl = () => Promise<ITwitterOAuthUrl>;
export type TGetTwitterRefreshToken = (twitterRefreshToken: string) => Promise<ITwitterToken | any>;

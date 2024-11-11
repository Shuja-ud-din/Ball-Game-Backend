import { IDecodedToken } from './types/user.types';

declare module 'express-serve-static-core' {
  export interface Request {
    user: IDecodedToken;
  }
}

import 'express-session';

declare module 'express-session' {
  interface SessionData {
    codeVerifier: string;
    state: string;
  }
}

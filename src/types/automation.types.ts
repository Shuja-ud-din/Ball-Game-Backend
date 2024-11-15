import { IGame } from './games.types';

export type TGenerateAndPostTweet = (game: IGame) => Promise<void>;

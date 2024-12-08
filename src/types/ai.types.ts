import { AccountType, AIPersonality } from '@/constants/enums';

import { IGame } from './games.types';

export interface IAIComment {
  comment: string;
  personality: AIPersonality;
}

export interface IAIResponse {
  accountType: AccountType.MAIN;
  tweet: string;
  comments: IAIComment[];
}

export type TGenerateTweet = (game: IGame) => Promise<string>;
export type TGenerateComment = (game: IGame, personality: AIPersonality, tweet: string) => Promise<string>;

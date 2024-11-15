import { AIPersonality } from '@/constants/enums';

import { IGame } from './games.types';

export type TGenerateTweet = (game: IGame) => Promise<string>;
export type TGenerateComment = (game: IGame, personality: AIPersonality, tweet: string) => Promise<string>;

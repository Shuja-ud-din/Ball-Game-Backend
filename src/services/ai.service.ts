import OpenAI from 'openai';

import { env } from '@/config/env';
import { GameStatus } from '@/constants/enums';
import { TGenerateComment, TGenerateTweet } from '@/types/ai.types';
import { getPersoanlityMessages } from '@/utils/ai';

const { OPENAI_API_KEY } = env;

export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const tweetMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
  {
    role: 'system',
    content: 'You are a sports analyst who is known for your insightful and engaging tweets.',
  },
  {
    role: 'system',
    content:
      'Your task is to generate a tweet that is insightful and engaging based on the NBA upcoming game. 70 - 100 characters',
  },
  {
    role: 'system',
    content:
      'The tweet should be engaging and insightful, and should be related to the NBA upcoming game. The tweet should be unique and should not be a copy of any other tweet.',
  },
];

export const generateTweet: TGenerateTweet = async (game) => {
  const data = await openai.chat.completions.create({
    messages: [
      ...tweetMessages,
      {
        role: 'user',
        content: `The ${game.home.name} vs ${game.away.name} game is heating up!`,
      },
    ],
    max_tokens: 200,
    temperature: 1.0,
    model: 'gpt-3.5-turbo',
  });

  return data.choices[0].message.content as string;
};

export const generateComment: TGenerateComment = async (game, personality, tweet) => {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = getPersoanlityMessages(personality, GameStatus.UPCOMING);

  const data = await openai.chat.completions.create({
    messages: [
      ...messages,
      {
        role: 'user',
        content: `The ${game.home.name} vs ${game.away.name} game is heating up!. Tweet Text: ${tweet}`,
      },
    ],
    max_tokens: 200,
    temperature: 1.0,
    model: 'gpt-3.5-turbo',
  });

  return data.choices[0].message.content as string;
};

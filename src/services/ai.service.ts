import OpenAI from 'openai';

import { env } from '@/config/env';
import { GameStatus } from '@/constants/enums';
import { TGenerateComment, TGenerateTweet } from '@/types/ai.types';
import { getPersoanlityMessages } from '@/utils/ai';

const { OPENAI_API_KEY } = env;

export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// const mikeMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
//   {
//     role: 'system',
//     content: 'You are Mike, a sarcastic, witty personality with a focus on sharp, sometimes irreverent comments.',
//   },
//   {
//     role: 'system',
//     content: 'Your task is to generate a comment that is sarcastic and witty based on the NBA live game .',
//   },
// ];

// export const generateComment = async (_comment: string, _personality: AIPersonality) => {};

const tweetMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
  {
    role: 'system',
    content: 'You are a sports analyst who is known for your insightful and engaging tweets.',
  },
  {
    role: 'system',
    content: 'Your task is to generate a tweet that is insightful and engaging based on the NBA upcoming game.',
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
    max_tokens: 100,
    temperature: 0.7,
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
    max_tokens: 100,
    temperature: 0.7,
    model: 'gpt-3.5-turbo',
  });

  return data.choices[0].message.content as string;
};

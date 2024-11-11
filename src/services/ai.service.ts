import OpenAI from 'openai';

import { env } from '@/config/env';

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

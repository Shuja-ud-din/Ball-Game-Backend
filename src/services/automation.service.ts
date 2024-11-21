import schedule from 'node-schedule';

import { AccountType, AIPersonality } from '@/constants/enums';
import { TGenerateAndPostTweet } from '@/types/automation.types';

import { generateComment, generateTweet } from './ai.service';
import { postTwitterComment, postTwitterTweet } from './twitter.service';

export const generateAndPostTweet: TGenerateAndPostTweet = async (game) => {
  try {
    const tweet = await generateTweet(game);

    const tweetResponse = await postTwitterTweet(tweet);
    console.log('Tweet posted:', tweetResponse.data);

    const { id: tweetId } = tweetResponse.data;

    for (let i = 1; i <= 4; i++) {
      const commentPostTime = new Date(new Date().getTime() + 60000 * i);

      schedule.scheduleJob(
        commentPostTime,
        (() => {
          const currentIndex = i; // Capture the current value of `i`
          return async () => {
            try {
              const comment = await generateComment(game, AIPersonality.MIKE, tweet);
              await postTwitterComment(comment, tweetId, currentIndex % 2 === 0 ? AccountType.MIKE : AccountType.LARRY);
              console.log('Comment posted:', comment, currentIndex % 2 === 0 ? 'Mike' : 'Larry');
            } catch (e) {
              console.log('Error:', e);
            }
          };
        })()
      );
    }
  } catch (e) {
    console.log('Error:', e);
  }
};

import schedule from 'node-schedule';

import { AccountType, AIPersonality } from '@/constants/enums';
import { TGenerateAndPostTweet } from '@/types/automation.types';

import { generateComment, generateTweet } from './ai.service';
import { postTwitterComment, postTwitterTweet } from './twitter.service';

export const generateAndPostTweet: TGenerateAndPostTweet = async (game) => {
  try {
    const tweet = await generateTweet(game);
    console.log('Tweet generated:', tweet);

    const tweetResponse = await postTwitterTweet(tweet);
    console.log('Tweet posted:', tweetResponse.data);

    const { id: tweetId } = tweetResponse.data;

    for (let i = 0; i < 4; i++) {
      const commentPostTime = new Date(new Date().getTime() + 15 * 60000 * i); // 15 minutes

      schedule.scheduleJob(commentPostTime, async () => {
        try {
          const comment = await generateComment(game, AIPersonality.MIKE, tweet);
          console.log('Comment generated:', comment);

          const accountType = i % 2 === 0 ? AccountType.MIKE : AccountType.LARRY;
          await postTwitterComment(comment, tweetId, accountType);
          console.log('Comment posted:', comment, accountType === AccountType.MIKE ? 'Mike' : 'Larry');
        } catch (e) {
          console.error('Error posting comment:', e);
        }
      });
    }
  } catch (e) {
    console.error('Error generating and posting tweet:', e);
  }
};

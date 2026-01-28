import { Tweet } from "react-tweet";
import type { CuratedTweet } from "@/lib/types";

interface TweetWallProps {
  tweets: CuratedTweet[];
}

export function TweetWall({ tweets }: TweetWallProps) {
  if (tweets.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-bold mb-3">Transfer Buzz</h2>
      <div className="space-y-4">
        {tweets.map((tweet) => (
          <div key={tweet.id} className="[&>div]:!my-0">
            {tweet.label && (
              <p className="text-xs text-muted-foreground mb-1 font-medium">
                {tweet.label}
              </p>
            )}
            <Tweet id={tweet.id} />
          </div>
        ))}
      </div>
    </div>
  );
}

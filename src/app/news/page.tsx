import { Suspense } from "react";
import { TweetWall } from "@/components/tweet-wall";
import { NewsPageClient } from "@/components/news-page-client";
import { Skeleton } from "@/components/ui/skeleton";
import { getNewsFeeds, categorizeArticle } from "@/lib/rss";
import type { CuratedTweetsData } from "@/lib/types";
import tweetsData from "@/data/curated-tweets.json";

export const revalidate = 300;

export const metadata = {
  title: "News | Chelsea FC Hub",
  description: "Latest Chelsea FC news, transfer rumors, and updates.",
};

export default async function NewsPage() {
  const articles = await getNewsFeeds();
  const categorized = articles.map(categorizeArticle);
  const tweets = (tweetsData as CuratedTweetsData).tweets;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">News & Transfers</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Suspense
            fallback={
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-lg" />
                ))}
              </div>
            }
          >
            <NewsPageClient articles={categorized} />
          </Suspense>
        </div>

        <aside>
          <Suspense
            fallback={
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-lg" />
                ))}
              </div>
            }
          >
            <TweetWall tweets={tweets} />
          </Suspense>
        </aside>
      </div>
    </div>
  );
}

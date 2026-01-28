import Parser from "rss-parser";
import type { NewsItem } from "./types";

const parser = new Parser({
  timeout: 10000,
});

const FEEDS = [
  {
    url: "https://feeds.bbci.co.uk/sport/football/teams/chelsea/rss.xml",
    name: "BBC Sport",
  },
  {
    url: "https://www.theguardian.com/football/chelsea/rss",
    name: "The Guardian",
  },
  {
    url: "https://www.football365.com/feed",
    name: "Football365",
    filterChelsea: true,
  },
];

export async function getNewsFeeds(): Promise<NewsItem[]> {
  const results = await Promise.allSettled(
    FEEDS.map(async (feed): Promise<NewsItem[]> => {
      const parsed = await parser.parseURL(feed.url);
      let items: NewsItem[] = parsed.items.map((item) => {
        const article: NewsItem = {
          title: item.title ?? "",
          link: item.link ?? "",
          pubDate: item.pubDate ?? item.isoDate ?? "",
          contentSnippet: (item.contentSnippet ?? item.content ?? "").slice(0, 200),
          source: feed.name,
        };
        if (item.enclosure?.url) {
          article.imageUrl = item.enclosure.url;
        }
        return article;
      });

      if (feed.filterChelsea) {
        items = items.filter(
          (item) =>
            item.title.toLowerCase().includes("chelsea") ||
            item.contentSnippet.toLowerCase().includes("chelsea")
        );
      }

      return items;
    })
  );

  const articles = results
    .filter(
      (r): r is PromiseFulfilledResult<NewsItem[]> =>
        r.status === "fulfilled"
    )
    .flatMap((r) => r.value)
    .filter((a) => a.title && a.link)
    .sort(
      (a, b) =>
        new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    )
    .slice(0, 30);

  return articles;
}

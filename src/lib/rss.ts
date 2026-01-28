import Parser from "rss-parser";
import type { NewsItem, CategorizedNewsItem } from "./types";

const parser = new Parser({
  timeout: 10000,
});

const TRANSFER_KEYWORDS = [
  "transfer", "sign", "signing", "signs", "deal", "loan",
  "bid", "offer", "target", "want", "agree", "confirm",
  "fee", "contract", "swap", "release", "departure",
  "move", "join", "joins", "joined", "exit", "sell",
  "buy", "purchase", "negotiate", "talks", "deadline",
];

const MATCH_REPORT_KEYWORDS = [
  "match report", "player ratings", "post-match", "post match",
  "recap", "result:", "results:", "analysis:", "reaction",
  "highlights", "goals:", "goal:", "scored", "beaten",
  "win ", "wins ", "won ", "lose ", "lost ", "draw ",
  "defeat", "victory", "comeback",
];

const PREVIEW_KEYWORDS = [
  "preview", "predicted lineup", "predicted line-up",
  "team news", "how to watch", "kick-off", "kick off",
  "build-up", "build up", "ahead of", "face ", "faces ",
  "host ", "hosts ", "travel to", "preparing",
];

export function categorizeArticle(article: NewsItem): CategorizedNewsItem {
  const text = `${article.title} ${article.contentSnippet}`.toLowerCase();

  if (MATCH_REPORT_KEYWORDS.some((kw) => text.includes(kw))) {
    return { ...article, category: "Match Reports" };
  }
  if (PREVIEW_KEYWORDS.some((kw) => text.includes(kw))) {
    return { ...article, category: "Preview" };
  }
  if (TRANSFER_KEYWORDS.some((kw) => text.includes(kw))) {
    return { ...article, category: "Transfers" };
  }
  return { ...article, category: "News" };
}

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

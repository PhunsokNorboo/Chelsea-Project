import type { NewsItem } from "@/lib/types";
import { NewsArticleCard } from "./news-article-card";

interface NewsFeedProps {
  articles: NewsItem[];
}

export function NewsFeed({ articles }: NewsFeedProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No news articles available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {articles.map((article, i) => (
        <NewsArticleCard key={`${article.link}-${i}`} article={article} />
      ))}
    </div>
  );
}

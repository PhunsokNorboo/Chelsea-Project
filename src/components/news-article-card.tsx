import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { NewsItem } from "@/lib/types";
import { relativeTime } from "@/lib/utils";

interface NewsArticleCardProps {
  article: NewsItem;
  category?: string;
}

export function NewsArticleCard({ article, category }: NewsArticleCardProps) {
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <Card className="transition-colors hover:bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {article.imageUrl && (
              <img
                src={article.imageUrl}
                alt=""
                className="h-16 w-24 object-cover rounded shrink-0 hidden sm:block"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {category && (
                  <Badge variant="outline" className="text-[10px] shrink-0">
                    {category}
                  </Badge>
                )}
                <Badge variant="secondary" className="text-[10px] shrink-0">
                  {article.source}
                </Badge>
                <span className="text-[11px] text-muted-foreground">
                  {article.pubDate ? relativeTime(article.pubDate) : ""}
                </span>
              </div>
              <h3 className="font-semibold text-sm leading-snug line-clamp-2 mb-1">
                {article.title}
              </h3>
              {article.contentSnippet && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {article.contentSnippet}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

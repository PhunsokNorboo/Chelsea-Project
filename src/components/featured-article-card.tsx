import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CategorizedNewsItem } from "@/lib/types";
import { relativeTime } from "@/lib/utils";

interface FeaturedArticleCardProps {
  article: CategorizedNewsItem;
}

export function FeaturedArticleCard({ article }: FeaturedArticleCardProps) {
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <Card className="transition-colors hover:bg-muted/50 overflow-hidden">
        <CardContent className="p-0">
          {article.imageUrl && (
            <img
              src={article.imageUrl}
              alt=""
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default" className="text-[10px]">
                {article.category}
              </Badge>
              <Badge variant="secondary" className="text-[10px]">
                {article.source}
              </Badge>
              <span className="text-[11px] text-muted-foreground">
                {article.pubDate ? relativeTime(article.pubDate) : ""}
              </span>
            </div>
            <h3 className="font-bold text-lg leading-snug mb-2">
              {article.title}
            </h3>
            {article.contentSnippet && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {article.contentSnippet}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

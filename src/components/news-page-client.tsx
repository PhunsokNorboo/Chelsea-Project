"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsSearch } from "@/components/news-search";
import { FeaturedArticleCard } from "@/components/featured-article-card";
import { NewsArticleCard } from "@/components/news-article-card";
import { Badge } from "@/components/ui/badge";
import type { CategorizedNewsItem } from "@/lib/types";

const CATEGORIES = ["All", "Transfers", "Match Reports", "Preview", "News"] as const;

interface NewsPageClientProps {
  articles: CategorizedNewsItem[];
}

export function NewsPageClient({ articles }: NewsPageClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: articles.length };
    for (const article of articles) {
      counts[article.category] = (counts[article.category] ?? 0) + 1;
    }
    return counts;
  }, [articles]);

  const filtered = useMemo(() => {
    let items = articles;
    if (activeCategory !== "All") {
      items = items.filter((a) => a.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.contentSnippet.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q)
      );
    }
    return items;
  }, [articles, activeCategory, search]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="flex-1"
        >
          <TabsList className="flex-wrap h-auto gap-1">
            {CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="text-xs gap-1.5"
              >
                {cat}
                {(categoryCounts[cat] ?? 0) > 0 && (
                  <Badge
                    variant="secondary"
                    className="h-4 px-1 text-[9px] leading-none"
                  >
                    {categoryCounts[cat]}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="w-full sm:w-56">
          <NewsSearch value={search} onChange={setSearch} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No articles match your filter.</p>
        </div>
      ) : (
        <>
          {featured && <FeaturedArticleCard article={featured} />}
          {rest.length > 0 && (
            <div className="space-y-3">
              {rest.map((article, i) => (
                <NewsArticleCard
                  key={`${article.link}-${i}`}
                  article={article}
                  category={article.category}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

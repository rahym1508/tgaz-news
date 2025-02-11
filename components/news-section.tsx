"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArticleCard } from "@/components/article-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import type { NewsArticle } from "@/types/news"

interface NewsSectionProps {
  initialArticles: NewsArticle[]
}

export function NewsSection({ initialArticles }: NewsSectionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [articles, setArticles] = useState(initialArticles)
  const [error, setError] = useState<string | null>(null)

  return (
    <section className="container py-12">
      <Alert className="mb-6 border-secondary/50 bg-secondary/10">
        <AlertDescription className="text-secondary-foreground">
          Этот сайт агрегирует новости из различных источников. Нажмите на статьи, чтобы прочитать полный текст.
        </AlertDescription>
      </Alert>
      <div className="max-w-3xl mx-auto space-y-6">
        {initialArticles.map((article) => (
          <ArticleCard key={article.id} {...article} />
        ))}
      </div>
    </section>
  )
} 
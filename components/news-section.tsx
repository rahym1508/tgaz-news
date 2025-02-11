"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArticleCard } from "@/components/article-card"
import type { NewsArticle } from "@/types/news"

interface NewsSectionProps {
  initialArticles: NewsArticle[]
}

export function NewsSection({ initialArticles }: NewsSectionProps) {
  const [articles, setArticles] = useState(initialArticles)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/admin/news', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        if (!response.ok) throw new Error('Failed to fetch news')
        const data = await response.json()
        setArticles(data)
      } catch (error) {
        console.error('Error fetching news:', error)
      }
    }

    // Fetch immediately and then every 10 seconds
    fetchNews()
    const interval = setInterval(fetchNews, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="container py-12">
      <Alert className="mb-6 border-secondary/50 bg-secondary/10">
        <AlertDescription className="text-secondary-foreground">
          Этот сайт агрегирует новости из различных источников. Нажмите на статьи, чтобы прочитать полный текст.
        </AlertDescription>
      </Alert>
      <div className="max-w-3xl mx-auto space-y-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} {...article} />
        ))}
      </div>
    </section>
  )
} 
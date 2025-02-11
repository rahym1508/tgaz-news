import { db } from "@/lib/db"
import type { NewsArticle } from "@/types/news"

export async function getNews(): Promise<NewsArticle[]> {
  try {
    const news = await db.news.findMany({
      orderBy: { date: 'desc' },
      take: 20
    })

    return news.map((article): NewsArticle => ({
      id: article.id,
      title: article.title,
      content: article.content,
      source: article.source,
      imageUrl: article.imageUrl || undefined,
      date: new Date(article.date).toLocaleDateString("ru-RU"),
      url: `/news/${article.id}` // Internal URL for full article view
    }))
  } catch (error) {
    console.error('Error fetching news:', error)
    return []
  }
}
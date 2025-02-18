import { db } from "@/lib/db"
import type { NewsArticle } from "@/types/news"

export async function getNews(): Promise<NewsArticle[]> {
  try {
    const news = await db.news.findMany({
      orderBy: { publishedAt: 'desc' },
      take: 20
    })

    if (!news?.length) {
      console.error('No news found')
      return []
    }

    return news.map((article): NewsArticle => ({
      id: article.id,
      title: article.title,
      content: article.content,
      source: article.source,
      imageUrl: article.imageUrl || undefined,
      date: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("ru-RU") : 'No date',
      url: `/news/${article.id}`
    }))
  } catch (error) {
    console.error('Error fetching news:', error)
    return []
  }
}
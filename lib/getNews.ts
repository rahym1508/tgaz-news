import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import type { NewsArticle } from "@/types/news"

export async function getNews(): Promise<NewsArticle[]> {
  try {
    const news = await db.news.findMany({
      orderBy: { publishedAt: 'desc' },
      where: {
        status: 'published',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
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
      sourceUrl: article.sourceUrl || undefined,
      imageUrl: article.imageUrl || undefined,
      status: article.status,
      publishedAt: formatDate(article.publishedAt),
      authorId: article.authorId,
      author: article.author,
      slug: article.slug,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      url: `/news/${article.id}`
    }))
  } catch (error) {
    console.error('Error fetching news:', error)
    return []
  }
}
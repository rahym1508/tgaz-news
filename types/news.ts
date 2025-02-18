export interface NewsArticle {
  id: string
  title: string
  content: string
  source: string
  sourceUrl?: string
  imageUrl?: string
  publishedAt?: string | Date | null
  url?: string
  status: "draft" | "published"
}

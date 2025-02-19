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
  slug: string
  excerpt?: string
  featured?: boolean
  views?: number
  authorId?: string | null
  author?: {
    id: string
    name: string
    email: string
  } | null
  metaTitle?: string
  metaDesc?: string
  createdAt: Date
  updatedAt: Date
}

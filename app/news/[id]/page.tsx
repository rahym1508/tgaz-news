import { db } from "@/lib/db"
import { SiteHeader } from "@/components/site-header"
import { notFound } from "next/navigation"
import { formatDate } from "@/lib/utils"
import Image from "next/image"

export default async function NewsPage({ params }: { params: { id: string } }) {
  const news = await db.news.findUnique({
    where: { id: params.id }
  })

  if (!news) {
    notFound()
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <article className="container py-12 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight">{news.title}</h1>
          <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
            <span>{news.source}</span>
            <span>{news.publishedAt ? formatDate(news.publishedAt) : 'No date'}</span>
          </div>
          {news.imageUrl && (
            <div className="relative w-full h-[400px] my-8">
              <Image
                src={news.imageUrl}
                alt={news.title}
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          )}
          <div className="mt-8 prose prose-slate max-w-none">
            {news.content.split('\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </article>
      </main>
    </div>
  )
} 
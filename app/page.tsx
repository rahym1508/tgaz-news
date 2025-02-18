import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { NewsSection } from "@/components/news-section"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

// Add revalidation
export const revalidate = 0

export default async function Home() {
  const news = await prisma.news.findMany({
    orderBy: { date: "desc" },
    take: 20,
    where: {
      status: "published",
    },
    include: {
      categories: true,
      tags: true,
    },
  })

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <div className="flex min-h-screen flex-col items-center justify-between p-24">
          <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
            <h1 className="text-4xl font-bold mb-8">Latest News</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news.map((article) => (
                <div
                  key={article.id}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  {article.imageUrl && (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                  <p className="text-gray-600 mb-4">
                    {article.excerpt || article.content.slice(0, 150)}...
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{new Date(article.date).toLocaleDateString("ru-RU")}</span>
                    <a
                      href={`/news/${article.id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Read more →
                    </a>
                  </div>
                  {article.categories.length > 0 && (
                    <div className="mt-3 flex gap-2">
                      {article.categories.map((category) => (
                        <span
                          key={category.id}
                          className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-4 md:py-6 bg-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
            <p className="text-center text-xs md:text-sm text-muted-foreground">
              2024 Все права защищены.
            </p>
            <nav className="flex flex-wrap justify-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-primary">О нас</Link>
              <Link href="/contact" className="hover:text-primary">Контакты</Link>
              <Link href="/privacy" className="hover:text-primary">Конфиденциальность</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}

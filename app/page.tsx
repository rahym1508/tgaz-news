import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { NewsSection } from "@/components/news-section"
import Link from "next/link"
import { getNews } from "@/lib/getNews"
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/loading-spinner"

// Add revalidation
export const revalidate = 0

export default async function Home() {
  const articles = await getNews()

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <Suspense fallback={<LoadingSpinner />}>
          <NewsSection initialArticles={articles} />
        </Suspense>
      </main>
      <footer className="border-t py-6 bg-primary/5">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2024 Туркменгаз. Все права защищены. Новостной контент принадлежит соответствующим издателям.
          </p>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-primary">
              О нас
            </Link>
            <Link href="/contact" className="hover:text-primary">
              Контакты
            </Link>
            <Link href="/privacy" className="hover:text-primary">
              Конфиденциальность
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}


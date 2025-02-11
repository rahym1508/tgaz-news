import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { NewsSection } from "@/components/news-section"
import Link from "next/link"
import { getNews } from "@/lib/getNews"

// Add revalidation
export const revalidate = 0

export default async function Home() {
  const articles = await getNews()

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <NewsSection initialArticles={articles} />
      </main>
      <footer className="border-t py-4 md:py-6 bg-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
            <p className="text-center text-xs md:text-sm text-muted-foreground">
              © 2024 Туркменгаз. Все права защищены.
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


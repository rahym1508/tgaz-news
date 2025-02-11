import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/Button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tkmgaz-removebg-preview-TrAJuIgbXhpss42k4Yu9bBVobY6cY3.png"
              alt="Логотип Туркменгаз"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="hidden font-bold sm:inline-block text-primary">Новости Туркменгаз</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/news"
              className="flex items-center text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Новости
            </Link>
            <Link
              href="/industry"
              className="flex items-center text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Промышленность
            </Link>
            <Link
              href="/analysis"
              className="flex items-center text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Анализ
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              Войти
            </Button>
            <Button size="sm">Подписаться</Button>
          </nav>
        </div>
      </div>
      <Sheet>
        <SheetTrigger className="md:hidden">
          <Menu className="h-6 w-6" />
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="flex flex-col gap-4">
            <Link href="/news">Новости</Link>
            <Link href="/industry">Промышленность</Link>
            <Link href="/analysis">Анализ</Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}


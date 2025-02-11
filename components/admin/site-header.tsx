import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <div className="flex gap-6 md:gap-10">
          <Link href="/admin" className="flex items-center space-x-2">
            <span className="font-bold">Админ панель</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/">Вернуться на сайт</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
} 
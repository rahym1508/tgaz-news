import Link from "next/link"
import { Button } from "@/components/Button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 md:h-16 items-center justify-between">
        {/* Mobile Menu Trigger */}
        <Sheet>
          <SheetTrigger className="md:hidden p-2 -ml-2">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[80%] sm:w-[300px] p-0">
            <div className="flex flex-col h-full">
              <div className="border-b px-6 py-4">
                <Link href="/" className="font-bold text-lg" onClick={(e) => {
                  const close = document.querySelector('[data-close-sheet]')
                  if (close instanceof HTMLElement) close.click()
                }}>
                  Новостной портал
                </Link>
              </div>
              <nav className="flex-1 px-6 py-4">
                <div className="flex flex-col space-y-4">
                  <Link 
                    href="/news" 
                    className="text-lg font-medium text-muted-foreground hover:text-primary"
                    onClick={(e) => {
                      const close = document.querySelector('[data-close-sheet]')
                      if (close instanceof HTMLElement) close.click()
                    }}
                  >
                    Новости
                  </Link>
                  <Link 
                    href="/industry" 
                    className="text-lg font-medium text-muted-foreground hover:text-primary"
                    onClick={(e) => {
                      const close = document.querySelector('[data-close-sheet]')
                      if (close instanceof HTMLElement) close.click()
                    }}
                  >
                    Промышленность
                  </Link>
                  <Link 
                    href="/analysis" 
                    className="text-lg font-medium text-muted-foreground hover:text-primary"
                    onClick={(e) => {
                      const close = document.querySelector('[data-close-sheet]')
                      if (close instanceof HTMLElement) close.click()
                    }}
                  >
                    Анализ
                  </Link>
                </div>
              </nav>
              <div className="border-t px-6 py-4">
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    Войти
                  </Button>
                  <Button className="w-full justify-start" size="sm">
                    Подписаться
                  </Button>
                </div>
              </div>
            </div>
            <SheetClose data-close-sheet className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </SheetClose>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="font-bold text-base md:text-lg text-primary">
              Новостной портал
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link
            href="/news"
            className="text-base font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Новости
          </Link>
          <Link
            href="/industry"
            className="text-base font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Промышленность
          </Link>
          <Link
            href="/analysis"
            className="text-base font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Анализ
          </Link>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Войти
          </Button>
          <Button size="sm">
            Подписаться
          </Button>
        </div>

        {/* Mobile Buttons */}
        <div className="md:hidden">
          <Button size="sm">
            Войти
          </Button>
        </div>
      </div>
    </header>
  )
}


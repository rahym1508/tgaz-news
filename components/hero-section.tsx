import { Button } from "@/components/Button"

export function HeroSection() {
  return (
    <section className="container flex flex-col items-center justify-center space-y-4 py-32 text-center">
      <h1 className="text-4xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl lg:text-7xl">
        Новости нефтегазовой отрасли
      </h1>
      <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
        Будьте в курсе последних новостей и аналитики энергетического сектора
      </p>
      <Button size="lg" className="mt-6 bg-secondary text-secondary-foreground hover:bg-secondary/90">
        Начать чтение
      </Button>
    </section>
  )
}


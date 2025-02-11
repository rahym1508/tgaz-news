import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Туркменгаз Новости',
  description: 'Агрегатор новостей Туркменгаз - последние новости и обновления',
  keywords: 'Туркменгаз, новости, Туркменистан, газовая промышленность',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

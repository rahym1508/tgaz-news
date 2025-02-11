import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Новостной портал',
  description: 'Агрегатор новостей - последние новости и обновления',
  keywords: 'новости, промышленность, анализ',
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

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Новостной портал',
  description: 'Агрегатор новостей - последние новости и обновления',
  keywords: 'новости, промышленность, анализ',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any'
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml'
      }
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico'
  }
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

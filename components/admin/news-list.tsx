"use client"

import { useEffect, useState } from "react"
import type { NewsArticle } from "@/types/news"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/loading-spinner"

export function NewsList() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchNews()
    
    // Listen for news updates
    window.addEventListener('news-created', fetchNews)
    return () => window.removeEventListener('news-created', fetchNews)
  }, [])

  async function fetchNews() {
    try {
      const response = await fetch('/api/admin/news')
      if (!response.ok) throw new Error('Failed to fetch news')
      const data = await response.json()
      setNews(data)
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить новости",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteNews(id: string) {
    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete news')
      
      toast({
        title: "Успешно",
        description: "Новость удалена",
      })
      
      fetchNews() // Refresh the list
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить новость",
        variant: "destructive",
      })
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Список новостей</h3>
        <p className="text-sm text-muted-foreground">
          Управление существующими новостями
        </p>
      </div>
      <div className="space-y-4">
        {news.map((article) => (
          <div key={article.id} className="border p-4 rounded-lg">
            <h4 className="font-medium">{article.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{article.source}</p>
            <div className="mt-2 flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => deleteNews(article.id)}
              >
                Удалить
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 
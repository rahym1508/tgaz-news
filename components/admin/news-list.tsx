"use client"

import { useEffect, useState } from "react"
import type { NewsArticle } from "@/types/news"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Pencil, Trash2 } from "lucide-react"

export function NewsList() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchNews()
    window.addEventListener('news-created', fetchNews)
    window.addEventListener('news-updated', fetchNews)
    return () => {
      window.removeEventListener('news-created', fetchNews)
      window.removeEventListener('news-updated', fetchNews)
    }
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
      
      fetchNews()
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить новость",
        variant: "destructive",
      })
    }
  }

  function handleEdit(article: NewsArticle) {
    setEditingNews(article)
    window.dispatchEvent(new CustomEvent('edit-news', { detail: article }))
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
                onClick={() => handleEdit(article)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Изменить
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => deleteNews(article.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 
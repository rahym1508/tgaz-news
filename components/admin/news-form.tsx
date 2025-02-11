"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { NewsArticle } from "@/types/news"

export function NewsForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null)

  useEffect(() => {
    const handleEdit = (event: CustomEvent<NewsArticle>) => {
      setEditingNews(event.detail)
      // Fill the form with article data
      const form = document.querySelector('form') as HTMLFormElement
      if (form) {
        form.title.value = event.detail.title
        form.content.value = event.detail.content
        form.source.value = event.detail.source
        form.sourceUrl.value = event.detail.sourceUrl || ''
        form.imageUrl.value = event.detail.imageUrl || ''
      }
    }

    window.addEventListener('edit-news', handleEdit as EventListener)
    return () => window.removeEventListener('edit-news', handleEdit as EventListener)
  }, [])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const url = editingNews 
        ? `/api/admin/news/${editingNews.id}`
        : '/api/admin/news'
      
      const response = await fetch(url, {
        method: editingNews ? 'PUT' : 'POST',
        body: JSON.stringify({
          title: formData.get('title'),
          content: formData.get('content'),
          source: formData.get('source'),
          sourceUrl: formData.get('sourceUrl'),
          imageUrl: formData.get('imageUrl') || null,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) throw new Error('Failed to save news')

      toast({
        title: "Успешно",
        description: editingNews ? "Новость обновлена" : "Новость создана",
      })
      
      // Dispatch event to refresh news list
      window.dispatchEvent(new Event(editingNews ? 'news-updated' : 'news-created'))
      
      // Reset form and editing state
      event.currentTarget.reset()
      setEditingNews(null)
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить новость",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">
          {editingNews ? "Редактировать новость" : "Создать новость"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {editingNews ? "Измените данные новости" : "Заполните форму для создания новой новости"}
        </p>
      </div>
      <div className="space-y-4">
        <Input name="title" placeholder="Заголовок новости" required />
        <Textarea 
          name="content" 
          placeholder="Содержание новости" 
          className="min-h-[150px]" 
          required 
        />
        <Input name="source" placeholder="Источник" required />
        <Input 
          name="sourceUrl" 
          type="url" 
          placeholder="URL источника" 
          required 
        />
        <Input 
          name="imageUrl" 
          type="url" 
          placeholder="URL изображения (необязательно)" 
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Сохранение..." : editingNews ? "Сохранить" : "Создать"}
        </Button>
        {editingNews && (
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              setEditingNews(null)
              event?.currentTarget.form?.reset()
            }}
          >
            Отменить
          </Button>
        )}
      </div>
    </form>
  )
} 
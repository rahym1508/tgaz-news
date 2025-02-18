"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { NewsArticle } from "@/types/news"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function NewsForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null)
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const handleEdit = (event: CustomEvent<NewsArticle>) => {
      setEditingNews(event.detail)
      setStatus(event.detail.status)
      // Fill the form with article data
      if (formRef.current) {
        const form = formRef.current
        const titleInput = form.querySelector('[name="title"]') as HTMLInputElement
        const contentInput = form.querySelector('[name="content"]') as HTMLTextAreaElement
        const sourceInput = form.querySelector('[name="source"]') as HTMLInputElement
        const sourceUrlInput = form.querySelector('[name="sourceUrl"]') as HTMLInputElement
        const imageUrlInput = form.querySelector('[name="imageUrl"]') as HTMLInputElement

        if (titleInput) titleInput.value = event.detail.title
        if (contentInput) contentInput.value = event.detail.content
        if (sourceInput) sourceInput.value = event.detail.source
        if (sourceUrlInput) sourceUrlInput.value = event.detail.sourceUrl || ''
        if (imageUrlInput) imageUrlInput.value = event.detail.imageUrl || ''
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
          status: status,
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
      
      window.dispatchEvent(new Event(editingNews ? 'news-updated' : 'news-created'))
      
      event.currentTarget.reset()
      setEditingNews(null)
      setStatus("draft")
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
    <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
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
          placeholder="URL источника (необязательно)" 
        />
        <Input 
          name="imageUrl" 
          type="url" 
          placeholder="URL изображения (необязательно)" 
        />
        <Select 
          value={status} 
          onValueChange={(value: "draft" | "published") => setStatus(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Черновик</SelectItem>
            <SelectItem value="published">Опубликовано</SelectItem>
          </SelectContent>
        </Select>
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
              formRef.current?.reset()
              setStatus("draft")
            }}
          >
            Отменить
          </Button>
        )}
      </div>
    </form>
  )
} 
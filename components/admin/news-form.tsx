"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export function NewsForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const response = await fetch('/api/admin/news', {
        method: 'POST',
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

      if (!response.ok) throw new Error('Failed to create news')

      toast({
        title: "Успешно",
        description: "Новость успешно создана",
      })
      
      // Dispatch event to refresh news list
      window.dispatchEvent(new Event('news-created'))
      
      // Reset form
      event.currentTarget.reset()
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать новость",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Создать новость</h3>
        <p className="text-sm text-muted-foreground">
          Заполните форму для создания новой новости
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
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Создание..." : "Создать новость"}
      </Button>
    </form>
  )
} 
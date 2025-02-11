import { NewsForm } from "@/components/admin/news-form"
import { NewsList } from "@/components/admin/news-list"

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Панель управления новостями</h2>
        <p className="text-muted-foreground">Создавайте и управляйте новостями сайта</p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <NewsForm />
        <NewsList />
      </div>
    </div>
  )
} 
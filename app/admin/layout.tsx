import { SiteHeader } from "@/components/admin/site-header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-6">
        {children}
      </main>
    </div>
  )
} 
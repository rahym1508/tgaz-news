import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import type { NewsArticle } from "@/types/news"

type ArticleCardProps = NewsArticle

export function ArticleCard({ title, content, source, date, url, imageUrl }: ArticleCardProps) {
  return (
    <Card className="group cursor-pointer transition-shadow hover:shadow-lg overflow-hidden">
      <Link href={url} className="flex gap-6 p-4">
        {imageUrl && (
          <div className="relative w-[200px] h-[140px] flex-shrink-0">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover rounded-md transition-transform group-hover:scale-105"
            />
          </div>
        )}
        <CardContent className="p-0 flex-1">
          <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {content}
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span>{source}</span>
            <span>•</span>
            <span>{date}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}


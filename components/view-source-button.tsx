"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface ViewSourceButtonProps {
  source: string
}

export function ViewSourceButton({ source }: ViewSourceButtonProps) {
  return (
    <Button 
      variant="outline" 
      onClick={() => window.open(source, '_blank')}
      className="mt-8"
    >
      <ExternalLink className="mr-2 h-4 w-4" />
      Читать оригинал на сайте {new URL(source).hostname}
    </Button>
  )
} 
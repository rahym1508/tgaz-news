import { NextResponse } from "next/server"
import { db } from "@/lib/db" // You'll need to set up a database

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const news = await db.news.create({
      data: {
        title: body.title,
        content: body.content,
        source: body.source,
        sourceUrl: body.sourceUrl,
        imageUrl: body.imageUrl,
        date: new Date().toISOString(),
      }
    })

    return NextResponse.json(news)
  } catch (error) {
    console.error("Error creating news:", error)
    return NextResponse.json(
      { error: "Failed to create news", details: error },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const news = await db.news.findMany({
      orderBy: { date: 'desc' },
      take: 20,
    })
    
    return NextResponse.json(news.map(article => ({
      ...article,
      date: article.date.toLocaleDateString("ru-RU"),
      url: `/news/${article.id}`
    })))
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json(
      { error: "Failed to fetch news", details: error },
      { status: 500 }
    )
  }
} 
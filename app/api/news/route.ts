import { NextResponse } from "next/server"
import { getNews } from "@/lib/getNews"

export async function GET() {
  try {
    const news = await getNews()
    return NextResponse.json(news)
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}


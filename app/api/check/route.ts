import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get all news
    const allNews = await prisma.news.findMany();
    console.log('Total news:', allNews.length);
    
    // Get published news
    const publishedNews = await prisma.news.findMany({
      where: {
        status: "published",
      },
    });
    console.log('Published news:', publishedNews.length);
    
    // Get news with dates
    const newsWithDates = await prisma.news.findMany({
      where: {
        NOT: {
          publishedAt: null,
        },
      },
    });
    console.log('News with dates:', newsWithDates.length);

    return NextResponse.json({
      total: allNews.length,
      published: publishedNews.length,
      withDates: newsWithDates.length,
      allNews,
      publishedNews,
      newsWithDates,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

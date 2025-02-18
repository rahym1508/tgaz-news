import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const slug = slugify(body.title, { lower: true, strict: true });

    const news = await prisma.news.create({
      data: {
        title: body.title,
        slug,
        content: body.content,
        source: body.source,
        sourceUrl: body.sourceUrl,
        imageUrl: body.imageUrl,
        status: body.status || "draft",
        publishedAt: body.status === "published" ? new Date() : null,
        authorId: session.user.id,
        categories: body.categories ? {
          connect: body.categories.map((id: string) => ({ id }))
        } : undefined,
        tags: body.tags ? {
          connect: body.tags.map((id: string) => ({ id }))
        } : undefined,
        metaTitle: body.metaTitle,
        metaDesc: body.metaDesc,
        date: new Date(),
      },
      include: {
        categories: true,
        tags: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Revalidate the home page
    revalidatePath("/");

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json(
      { error: "Failed to create news", details: error },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: { date: "desc" },
      take: 20,
      include: {
        categories: true,
        tags: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      news.map((article) => ({
        ...article,
        date: new Date(article.date).toLocaleDateString("ru-RU"),
        url: `/news/${article.id}`,
      })),
      {
        headers: {
          "Cache-Control": "no-store, must-revalidate",
          Pragma: "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
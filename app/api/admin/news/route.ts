import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
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

    revalidatePath("/");
    return NextResponse.json(news);
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json(
      { error: "Failed to create news article" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const news = await prisma.news.findMany({
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
      orderBy: { publishedAt: "desc" },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news articles" },
      { status: 500 }
    );
  }
}
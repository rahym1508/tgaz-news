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
    console.log("Creating news with data:", body);

    if (!body.title || !body.content || !body.source) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const slug = slugify(body.title, { lower: true, strict: true });

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      console.error("User not found:", session.user.id);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const news = await prisma.news.create({
      data: {
        title: body.title,
        slug,
        content: body.content,
        source: body.source,
        sourceUrl: body.sourceUrl || null,
        imageUrl: body.imageUrl || null,
        status: body.status || "draft",
        publishedAt: body.status === "published" ? new Date() : null,
        author: {
          connect: { id: user.id }
        },
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

    console.log("News created successfully:", news);
    revalidatePath("/");
    return NextResponse.json(news);
  } catch (error) {
    console.error("Detailed error creating news:", error);
    return NextResponse.json(
      { error: "Failed to create news article", details: error },
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
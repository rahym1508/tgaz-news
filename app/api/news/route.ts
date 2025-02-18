import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

// GET all news with filtering and pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");

    const where = {
      ...(status && { status }),
      ...(category && { categories: { some: { slug: category } } }),
      ...(tag && { tags: { some: { slug: tag } } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
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
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { publishedAt: "desc" },
      }),
      prisma.news.count({ where }),
    ]);

    return NextResponse.json({
      news,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST new article
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      content,
      source,
      sourceUrl,
      imageUrl,
      categories,
      tags,
      status,
      metaTitle,
      metaDesc,
    } = body;

    const slug = slugify(title, { lower: true, strict: true });

    const news = await prisma.news.create({
      data: {
        title,
        slug,
        content,
        source,
        sourceUrl,
        imageUrl,
        status,
        metaTitle,
        metaDesc,
        publishedAt: status === "published" ? new Date() : null,
        authorId: session.user.id,
        categories: {
          connect: categories?.map((id: string) => ({ id })) || [],
        },
        tags: {
          connect: tags?.map((id: string) => ({ id })) || [],
        },
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

    revalidatePath("/news");
    return NextResponse.json(news);
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH update article
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      title,
      content,
      source,
      sourceUrl,
      imageUrl,
      categories,
      tags,
      status,
      metaTitle,
      metaDesc,
    } = body;

    const existingNews = await prisma.news.findUnique({
      where: { id },
      include: { categories: true, tags: true },
    });

    if (!existingNews) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    // Only allow authors or admins to edit
    if (existingNews.authorId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const slug = title ? slugify(title, { lower: true, strict: true }) : existingNews.slug;

    const news = await prisma.news.update({
      where: { id },
      data: {
        ...(title && { title, slug }),
        ...(content && { content }),
        ...(source && { source }),
        ...(sourceUrl && { sourceUrl }),
        ...(imageUrl && { imageUrl }),
        ...(status && {
          status,
          publishedAt: status === "published" && !existingNews.publishedAt ? new Date() : undefined,
        }),
        ...(metaTitle && { metaTitle }),
        ...(metaDesc && { metaDesc }),
        ...(categories && {
          categories: {
            disconnect: existingNews.categories.map(cat => ({ id: cat.id })),
            connect: categories.map((id: string) => ({ id })),
          },
        }),
        ...(tags && {
          tags: {
            disconnect: existingNews.tags.map(tag => ({ id: tag.id })),
            connect: tags.map((id: string) => ({ id })),
          },
        }),
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

    revalidatePath("/news");
    return NextResponse.json(news);
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE article
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "News ID is required" }, { status: 400 });
    }

    const existingNews = await prisma.news.findUnique({ where: { id } });

    if (!existingNews) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    // Only allow authors or admins to delete
    if (existingNews.authorId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.news.delete({ where: { id } });

    revalidatePath("/news");
    return NextResponse.json({ message: "News deleted successfully" });
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

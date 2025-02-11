import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.news.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting news:", error)
    return NextResponse.json(
      { error: "Failed to delete news" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const news = await db.news.update({
      where: { id: params.id },
      data: {
        title: body.title,
        content: body.content,
        source: body.source,
        sourceUrl: body.sourceUrl,
        imageUrl: body.imageUrl,
      }
    })

    revalidatePath('/')

    return NextResponse.json(news)
  } catch (error) {
    console.error("Error updating news:", error)
    return NextResponse.json(
      { error: "Failed to update news", details: error },
      { status: 500 }
    )
  }
} 
import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();

async function migrateNews() {
  try {
    // Get all existing news
    const existingNews = await prisma.news.findMany();

    // Create a default category
    const defaultCategory = await prisma.category.create({
      data: {
        name: "General",
        slug: "general",
        description: "General news category",
      },
    });

    // Update each news article with new required fields
    for (const article of existingNews) {
      await prisma.news.update({
        where: { id: article.id },
        data: {
          slug: slugify(article.title, { lower: true, strict: true }),
          status: "published",
          publishedAt: new Date(), // Set to current date since we can't access the old date field
          categories: {
            connect: { id: defaultCategory.id },
          },
        },
      });
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateNews();

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const post = await prisma.news.create({
    data: {
      title: "Test News Article",
      slug: "test-news-article",
      content: "This is a test news article to verify that our database and website are working correctly.",
      excerpt: "A test article for verification purposes",
      source: "Internal Test",
      status: "published",
      publishedAt: new Date(),
      categories: {
        create: {
          name: "Test Category",
          slug: "test-category",
          description: "A test category"
        }
      },
      tags: {
        create: {
          name: "Test",
          slug: "test"
        }
      }
    },
  })
  
  console.log('Created post:', post)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

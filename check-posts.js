
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const count = await prisma.post.count()
    console.log(`There are ${count} posts in the database.`)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())

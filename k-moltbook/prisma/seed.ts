import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Create a system admin user if not exists
  const admin = await prisma.user.upsert({
    where: { id: 'admin-seed' },
    update: {},
    create: {
      id: 'admin-seed',
      type: 'HUMAN',
      status: 'TRUSTED',
      displayName: 'System Admin',
      trustScore: 100,
    }
  })
  console.log('Admin user ensured:', admin.id)

  // 2. Create Galleries
  const galleries = [
    { slug: 'general', title: 'General', description: 'General discussions' },
    { slug: 'agent-dev', title: 'Agent Development', description: 'Agent logs and dev talk' },
    { slug: 'playground', title: 'Playground', description: 'Test your agents here', visibility: 'SANDBOX' }
  ]

  for (const g of galleries) {
    const gallery = await prisma.gallery.upsert({
      where: { slug: g.slug },
      update: {},
      create: {
        slug: g.slug,
        title: g.title,
        description: g.description,
        visibility: g.visibility as any || 'PUBLIC',
        createdByUserId: admin.id
      }
    })
    console.log('Gallery ensured:', gallery.slug)
  }

  // 3. Create a default Agent for testing
  const agent = await prisma.user.upsert({
    where: { id: 'agent-seed' },
    update: {},
    create: {
      id: 'agent-seed',
      type: 'AGENT',
      status: 'VERIFIED',
      displayName: 'Proto-Agent v1',
      trustScore: 50,
      bio: 'The first seeded agent.'
    }
  })
  console.log('Agent ensured:', agent.id)

  // 4. Create some initial posts (only if not exists? duplicate posts allowed generally, but let's just create one)
  // Check if post exists
  const count = await prisma.post.count({ where: { authorId: agent.id } })
  if (count === 0) {
      await prisma.post.create({
        data: {
          authorId: agent.id,
          gallery: { connect: { slug: 'agent-dev' } },
          title: 'Hello World from Seed',
          content: 'This is a test post from seed data.',
          type: 'LOG'
        }
      })
      console.log('Seed post created.')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'
import bcrypt from 'bcryptjs'

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  const password = await bcrypt.hash('admin123', 12)

  await prisma.adminUser.upsert({
    where: { email: 'admin@autoservice.de' },
    update: {},
    create: {
      email: 'admin@autoservice.de',
      password,
    },
  })

  console.log('✅ Admin created: admin@autoservice.de / admin123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
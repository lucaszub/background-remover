import { PrismaClient, PlanType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Nettoyer les données existantes
  await prisma.quotaUsage.deleteMany()
  await prisma.userQuota.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  // Créer des utilisateurs de test
  const user1 = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      image: 'https://i.pravatar.cc/150?img=1',
      quota: {
        create: {
          dailyLimit: 10,
          dailyUsed: 3,
          monthlyLimit: null,
          monthlyUsed: 3,
          planType: PlanType.FREE
        }
      }
    }
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'premium@example.com',
      name: 'Premium User',
      image: 'https://i.pravatar.cc/150?img=2',
      quota: {
        create: {
          dailyLimit: 100,
          dailyUsed: 25,
          monthlyLimit: 1000,
          monthlyUsed: 25,
          planType: PlanType.PREMIUM
        }
      }
    }
  })

  // Créer des données d'usage pour les tests
  for (let i = 0; i < 3; i++) {
    await prisma.quotaUsage.create({
      data: {
        userId: user1.id,
        ipAddress: `192.168.1.${100 + i}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        fileSize: 500000 + Math.floor(Math.random() * 1000000),
        fileType: 'image/jpeg',
        processingTimeMs: 2000 + Math.floor(Math.random() * 3000),
        usedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000) // i jours dans le passé
      }
    })
  }

  for (let i = 0; i < 25; i++) {
    await prisma.quotaUsage.create({
      data: {
        userId: user2.id,
        ipAddress: `10.0.0.${50 + i}`,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        fileSize: 750000 + Math.floor(Math.random() * 1500000),
        fileType: Math.random() > 0.5 ? 'image/jpeg' : 'image/png',
        processingTimeMs: 1500 + Math.floor(Math.random() * 2000),
        usedAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000)
      }
    })
  }

  console.log('✅ Seed completed!')
  console.log(`Created users:`)
  console.log(`- ${user1.email} (FREE plan, 3/10 daily usage)`)
  console.log(`- ${user2.email} (PREMIUM plan, 25/100 daily usage)`)
  console.log(`Created ${3 + 25} usage records`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
# Prochaines étapes : Intégration avec Next.js

## 1. Configuration Prisma

### Installation
```bash
cd front/
npm install prisma @prisma/client
npm install -D prisma
```

### Initialisation
```bash
npx prisma init
```

### Schema Prisma minimal (prisma/schema.prisma)
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ====================================================================
// NEXTAUTH MODELS - Gestion d'authentification
// ====================================================================

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?   // Avatar utilisateur (URL)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  accounts      Account[]
  sessions      Session[]
  quota         UserQuota?
  usageHistory  QuotaUsage[]

  @@map("users")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// ====================================================================
// QUOTA MANAGEMENT MODELS - Gestion des quotas utilisateurs
// ====================================================================

model UserQuota {
  id          String    @id @default(cuid())
  userId      String    @unique

  // Quotas journaliers
  dailyLimit  Int       @default(10)  // Limite par jour
  dailyUsed   Int       @default(0)   // Utilisé aujourd'hui
  lastReset   DateTime  @default(now()) // Dernière réinitialisation

  // Quotas mensuels (pour les plans premium)
  monthlyLimit Int?     // Limite mensuelle (null = illimité)
  monthlyUsed  Int      @default(0)
  monthReset   DateTime @default(now())

  // Plan et statut
  planType    PlanType  @default(FREE)
  isActive    Boolean   @default(true)

  // Métadonnées
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_quotas")
}

model QuotaUsage {
  id         String   @id @default(cuid())
  userId     String

  // Tracking de l'utilisation
  ipAddress  String   // IP pour les utilisateurs non connectés
  userAgent  String?  // Navigateur/app

  // Métadonnées de l'image
  fileSize   Int?     // Taille du fichier traité
  fileType   String?  // Type MIME (image/jpeg, etc.)

  // Temps de traitement
  processingTimeMs Int? // Temps de traitement en ms

  // Timestamps
  usedAt     DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("quota_usage")
  @@index([userId, usedAt])
  @@index([usedAt]) // Pour les statistiques globales
}

// ====================================================================
// ENUMS
// ====================================================================

enum PlanType {
  FREE        // 10/jour
  PREMIUM     // 100/jour + 1000/mois
  ENTERPRISE  // Illimité (pour plus tard)
}
```

**Notes importantes :**

1. **Pas de stockage d'images** : Les modèles ne contiennent aucune référence aux images traitées
2. **Azure Blob Storage** : Sera configuré séparément pour le stockage des images
3. **Tracking minimal** : On track juste les métadonnées nécessaires (taille, type, temps)
4. **Plans évolutifs** : Structure prête pour différents plans tarifaires
5. **Index optimisés** : Pour les requêtes de statistiques

## 2. Configuration Next.js

### Variables d'environnement (.env.local)
```env
# Database
DATABASE_URL="postgresql://bg_user:bg_password_2024@localhost:5432/background_remover"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth (existant)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### Adapter NextAuth pour PostgreSQL
```typescript
// lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  // ... reste de la config
}
```

### Client Prisma (lib/prisma.ts)
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

## 3. Migration des quotas

### Nouveau service quotas (lib/quotas-db.ts)
```typescript
import { prisma } from '@/lib/prisma'
import { PlanType } from '@prisma/client'

export async function checkUserQuota(userId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let userQuota = await prisma.userQuota.findUnique({
    where: { userId }
  })

  if (!userQuota) {
    userQuota = await prisma.userQuota.create({
      data: {
        userId,
        quotaLimit: 10,
        usedCount: 0,
        resetAt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Demain
        planType: PlanType.FREE
      }
    })
  }

  // Réinitialiser si nécessaire
  if (userQuota.resetAt <= new Date()) {
    userQuota = await prisma.userQuota.update({
      where: { userId },
      data: {
        usedCount: 0,
        resetAt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    })
  }

  return {
    canUse: userQuota.usedCount < userQuota.quotaLimit,
    usage: userQuota.usedCount,
    limit: userQuota.quotaLimit,
    remaining: userQuota.quotaLimit - userQuota.usedCount
  }
}

export async function incrementUserQuota(userId: string, ipAddress: string) {
  await prisma.$transaction([
    prisma.userQuota.update({
      where: { userId },
      data: { usedCount: { increment: 1 } }
    }),
    prisma.quotaUsage.create({
      data: { userId, ipAddress }
    })
  ])
}
```

## 4. Commandes de migration

```bash
# Générer la migration
npx prisma migrate dev --name init

# Générer le client
npx prisma generate

# Voir la base
npx prisma studio
```

## 5. Refactoring de l'API

### Mise à jour /api/remove-background/route.ts
```typescript
import { getServerSession } from 'next-auth'
import { checkUserQuota, incrementUserQuota } from '@/lib/quotas-db'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  // Vérifier les quotas DB au lieu de Redis
  const quotaCheck = await checkUserQuota(session.user.id)

  if (!quotaCheck.canUse) {
    return NextResponse.json({
      error: 'Quota exceeded',
      ...quotaCheck
    }, { status: 429 })
  }

  // ... traitement de l'image ...

  // Incrémenter les quotas
  const ip = getClientIP(request)
  await incrementUserQuota(session.user.id, ip)

  return response
}
```

## 6. Scripts utiles

### Seed des données (prisma/seed.ts)
```typescript
import { PrismaClient, PlanType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Créer des utilisateurs de test
  const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      quotas: {
        create: {
          quotaLimit: 50,
          usedCount: 0,
          resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          planType: PlanType.PREMIUM
        }
      }
    }
  })

  console.log('Seed completed:', testUser)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

### Package.json scripts
```json
{
  "scripts": {
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset"
  }
}
```
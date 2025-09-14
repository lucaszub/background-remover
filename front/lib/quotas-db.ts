import { prisma } from '@/lib/prisma'
import { PlanType } from '@prisma/client'

interface QuotaCheckResult {
  canUse: boolean
  dailyUsage: number
  dailyLimit: number
  dailyRemaining: number
  monthlyUsage?: number
  monthlyLimit?: number
  planType: PlanType
  resetTime: string
  percentage: number
  status: 'safe' | 'warning' | 'critical'
  message: string
}

export async function checkUserQuota(userId: string): Promise<QuotaCheckResult> {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  let userQuota = await prisma.userQuota.findUnique({
    where: { userId }
  })

  // Créer quota si n'existe pas
  if (!userQuota) {
    userQuota = await prisma.userQuota.create({
      data: {
        userId,
        dailyLimit: 10,
        dailyUsed: 0,
        lastReset: startOfDay,
        monthlyLimit: null, // Pas de limite mensuelle pour FREE
        monthlyUsed: 0,
        monthReset: startOfMonth,
        planType: PlanType.FREE
      }
    })
  }

  // Réinitialiser quotas si nécessaire
  let needsUpdate = false
  const updates: any = {}

  if (userQuota.lastReset < startOfDay) {
    updates.dailyUsed = 0
    updates.lastReset = startOfDay
    needsUpdate = true
  }

  if (userQuota.monthReset < startOfMonth) {
    updates.monthlyUsed = 0
    updates.monthReset = startOfMonth
    needsUpdate = true
  }

  if (needsUpdate) {
    userQuota = await prisma.userQuota.update({
      where: { userId },
      data: updates
    })
  }

  // Calculer les quotas
  const dailyCanUse = userQuota.dailyUsed < userQuota.dailyLimit
  const monthlyCanUse = userQuota.monthlyLimit
    ? userQuota.monthlyUsed < userQuota.monthlyLimit
    : true

  const nextReset = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
  const percentage = Math.round((userQuota.dailyUsed / userQuota.dailyLimit) * 100)

  let status: 'safe' | 'warning' | 'critical' = 'safe'
  if (percentage >= 100) status = 'critical'
  else if (percentage >= 80) status = 'warning'

  const message = getQuotaMessage(userQuota.dailyUsed, userQuota.dailyLimit, userQuota.dailyUsed < userQuota.dailyLimit)

  return {
    canUse: dailyCanUse && monthlyCanUse && userQuota.isActive,
    dailyUsage: userQuota.dailyUsed,
    dailyLimit: userQuota.dailyLimit,
    dailyRemaining: userQuota.dailyLimit - userQuota.dailyUsed,
    monthlyUsage: userQuota.monthlyLimit ? userQuota.monthlyUsed : undefined,
    monthlyLimit: userQuota.monthlyLimit || undefined,
    planType: userQuota.planType,
    resetTime: nextReset.toISOString(),
    percentage,
    status,
    message
  }
}

export async function incrementUserQuota(
  userId: string,
  metadata: {
    ipAddress: string
    userAgent?: string | null
    fileSize?: number
    fileType?: string
    processingTimeMs?: number
  }
) {
  await prisma.$transaction([
    // Incrémenter les compteurs
    prisma.userQuota.update({
      where: { userId },
      data: {
        dailyUsed: { increment: 1 },
        monthlyUsed: { increment: 1 }
      }
    }),
    // Enregistrer l'utilisation
    prisma.quotaUsage.create({
      data: {
        userId,
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
        fileSize: metadata.fileSize,
        fileType: metadata.fileType,
        processingTimeMs: metadata.processingTimeMs
      }
    })
  ])
}

// Fonctions utilitaires
export async function getUserStats(userId: string, days: number = 30) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const usage = await prisma.quotaUsage.findMany({
    where: {
      userId,
      usedAt: { gte: startDate }
    },
    orderBy: { usedAt: 'desc' }
  })

  const totalUsage = usage.length
  const averageFileSize = totalUsage > 0 ? usage.reduce((acc, u) => acc + (u.fileSize || 0), 0) / totalUsage : 0
  const averageProcessingTime = totalUsage > 0 ? usage.reduce((acc, u) => acc + (u.processingTimeMs || 0), 0) / totalUsage : 0

  return {
    totalUsage,
    averageFileSize,
    averageProcessingTime,
    usageByDay: usage.reduce((acc, u) => {
      const day = u.usedAt.toISOString().split('T')[0]
      acc[day] = (acc[day] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }
}

function getQuotaMessage(used: number, limit: number, canUse: boolean): string {
  if (!canUse) {
    return `Daily limit reached (${used}/${limit}). Resets tomorrow.`
  }

  const remaining = limit - used
  if (remaining <= 2) {
    return `Only ${remaining} uses left today.`
  }

  return `${remaining} uses remaining today.`
}

// Fonction helper pour récupérer l'IP client
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  if (realIP) {
    return realIP
  }

  return 'unknown'
}
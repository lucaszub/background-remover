import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { checkUserQuota, getUserStats, getClientIP } from '@/lib/quotas-db'

export async function GET(request: NextRequest) {
  try {
    // Récupérer la session utilisateur
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      // Pour les utilisateurs non connectés
      return NextResponse.json({
        usage: 0,
        limit: 0,
        remaining: 0,
        canUse: false,
        percentage: 0,
        status: 'critical',
        message: 'Please sign in to track your usage',
        isAuthenticated: false,
        quotaType: 'free',
        resetTime: new Date(new Date().setHours(24, 0, 0, 0)).toISOString()
      })
    }

    // Récupérer les quotas utilisateur
    const quotaInfo = await checkUserQuota(session.user.id)
    const stats = await getUserStats(session.user.id, 7) // 7 derniers jours

    return NextResponse.json({
      usage: quotaInfo.dailyUsage,
      limit: quotaInfo.dailyLimit,
      remaining: quotaInfo.dailyRemaining,
      canUse: quotaInfo.canUse,
      percentage: quotaInfo.percentage,
      status: quotaInfo.status,
      message: quotaInfo.message,
      isAuthenticated: true,
      planType: quotaInfo.planType.toLowerCase(),
      resetTime: quotaInfo.resetTime,
      monthlyUsage: quotaInfo.monthlyUsage,
      monthlyLimit: quotaInfo.monthlyLimit,
      userInfo: {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image
      },
      quotaType: quotaInfo.planType.toLowerCase(),
      stats
    })

  } catch (error) {
    console.error('Quotas API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quota information' },
      { status: 500 }
    )
  }
}
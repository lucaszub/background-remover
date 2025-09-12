import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { checkQuota, getQuotaKey, getQuotaMessage } from '@/lib/quotas'

export async function GET(request: NextRequest) {
  try {
    // Récupérer la session utilisateur
    const session = await getServerSession(authOptions)
    
    // Déterminer l'IP (avec gestion des proxies)
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
    
    // Générer la clé de quota
    const quotaKey = getQuotaKey(session, ip)
    
    // Vérifier les quotas actuels
    const quotaCheck = await checkQuota(quotaKey)
    const isAuth = Boolean(session)
    
    // Calculer les informations supplémentaires
    const remaining = quotaCheck.limit - quotaCheck.usage
    const percentage = Math.round((quotaCheck.usage / quotaCheck.limit) * 100)
    const message = getQuotaMessage(quotaCheck.usage, quotaCheck.limit, isAuth)
    
    // Déterminer le statut de couleur pour l'UI
    let status: 'safe' | 'warning' | 'critical' = 'safe'
    if (percentage >= 80) {
      status = 'critical'
    } else if (percentage >= 50) {
      status = 'warning'
    }
    
    return NextResponse.json({
      usage: quotaCheck.usage,
      limit: quotaCheck.limit,
      remaining,
      canUse: quotaCheck.canUse,
      percentage,
      status,
      message,
      isAuthenticated: isAuth,
      userInfo: session?.user ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image
      } : null,
      quotaType: isAuth ? 'premium' : 'free',
      resetTime: new Date(new Date().setHours(24, 0, 0, 0)).toISOString() // Minuit suivant
    })
    
  } catch (error) {
    console.error('Quotas API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quota information' },
      { status: 500 }
    )
  }
}
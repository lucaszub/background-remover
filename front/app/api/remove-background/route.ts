import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { checkQuota, incrementQuota, getQuotaKey, getQuotaMessage } from '@/lib/quotas'

export async function POST(request: NextRequest) {
  try {
    // Récupérer la session utilisateur
    const session = await getServerSession(authOptions)
    
    // Déterminer l'IP (avec gestion des proxies)
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
    
    // Générer la clé de quota
    const quotaKey = getQuotaKey(session, ip)
    
    // Vérifier les quotas
    const quotaCheck = await checkQuota(quotaKey)
    
    if (!quotaCheck.canUse) {
      const isAuth = Boolean(session)
      const message = getQuotaMessage(quotaCheck.usage, quotaCheck.limit, isAuth)
      
      return NextResponse.json(
        { 
          error: 'Quota exceeded',
          message,
          usage: quotaCheck.usage,
          limit: quotaCheck.limit,
          isAuthenticated: isAuth
        },
        { status: 429 }
      )
    }
    
    // Récupérer le fichier depuis la requête
    const formData = await request.formData()
    const file = formData.get('image') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }
    
    // Valider le type de fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload JPEG, PNG, or WebP images.' },
        { status: 400 }
      )
    }
    
    // Valider la taille (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }
    
    // Préparer la requête vers FastAPI
    const fastApiFormData = new FormData()
    fastApiFormData.append('file', file, file.name)
    
    const fastApiUrl = process.env.FASTAPI_URL
    const fastApiKey = process.env.FASTAPI_SECRET_KEY
    
    if (!fastApiUrl || !fastApiKey) {
      console.error('FastAPI configuration missing')
      return NextResponse.json(
        { error: 'Service configuration error' },
        { status: 500 }
      )
    }
    
    // Debug logs
    console.log('FastAPI URL:', fastApiUrl)
    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // Appeler FastAPI pour le traitement ML
    const cleanUrl = fastApiUrl.endsWith('/') ? fastApiUrl.slice(0, -1) : fastApiUrl
    const response = await fetch(`${cleanUrl}/process-image`, {
      method: 'POST',
      headers: {
        'x-api-key': fastApiKey
      },
      body: fastApiFormData
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`FastAPI error: ${response.status}`, errorText)

      // Essayer de parser l'erreur JSON pour plus de détails
      try {
        const errorData = JSON.parse(errorText)
        console.error('FastAPI error details:', errorData)
      } catch {
        console.error('FastAPI raw error:', errorText)
      }

      return NextResponse.json(
        { error: 'Image processing failed' },
        { status: 500 }
      )
    }
    
    // Récupérer l'image traitée
    const processedImageBuffer = await response.arrayBuffer()
    
    // Incrémenter les quotas après succès
    await incrementQuota(quotaKey)
    
    // Retourner l'image traitée
    return new NextResponse(processedImageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="background-removed.png"',
        'X-Quota-Usage': String(quotaCheck.usage + 1),
        'X-Quota-Limit': String(quotaCheck.limit),
        'X-Quota-Remaining': String(quotaCheck.limit - quotaCheck.usage - 1)
      }
    })
    
  } catch (error) {
    console.error('Remove background error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
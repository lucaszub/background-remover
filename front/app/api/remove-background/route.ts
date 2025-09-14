import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { checkUserQuota, incrementUserQuota, getClientIP } from '@/lib/quotas-db'

export async function POST(request: NextRequest) {
  try {
    // Récupérer la session utilisateur
    const session = await getServerSession(authOptions)

    // Vérifier que l'utilisateur est connecté
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Vérifier les quotas DB
    const quotaCheck = await checkUserQuota(session.user.id)

    if (!quotaCheck.canUse) {
      return NextResponse.json(
        {
          error: 'Quota exceeded',
          message: quotaCheck.message,
          quotaInfo: {
            usage: quotaCheck.dailyUsage,
            limit: quotaCheck.dailyLimit,
            remaining: quotaCheck.dailyRemaining,
            resetTime: quotaCheck.resetTime,
            planType: quotaCheck.planType
          }
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
    
    // Récupérer métadonnées pour tracking
    const startTime = Date.now()
    const ip = getClientIP(request)
    const userAgent = request.headers.get('user-agent')

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
    const processingTime = Date.now() - startTime

    // Incrémenter les quotas après succès avec métadonnées
    await incrementUserQuota(session.user.id, {
      ipAddress: ip,
      userAgent,
      fileSize: file.size,
      fileType: file.type,
      processingTimeMs: processingTime
    })

    // Retourner l'image traitée
    return new NextResponse(processedImageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="background-removed.png"',
        'X-Quota-Usage': String(quotaCheck.dailyUsage + 1),
        'X-Quota-Limit': String(quotaCheck.dailyLimit),
        'X-Quota-Remaining': String(quotaCheck.dailyRemaining - 1),
        'X-Processing-Time': String(processingTime)
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
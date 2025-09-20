import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { azureStorage } from '@/lib/azure-storage'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '12')
    const search = url.searchParams.get('search') || ''
    const tags = url.searchParams.get('tags')?.split(',').filter(Boolean) || []
    const favoriteOnly = url.searchParams.get('favorites') === 'true'

    const skip = (page - 1) * limit

    // Build where clause
    const whereClause: {
      userId: string;
      OR?: Array<{ title?: { contains: string; mode: 'insensitive' }; originalName?: { contains: string; mode: 'insensitive' } }>;
      tags?: { hasEvery: string[] };
      isFavorite?: boolean;
    } = {
      userId: session.user.id
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { originalName: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (tags.length > 0) {
      whereClause.tags = { hasEvery: tags }
    }

    if (favoriteOnly) {
      whereClause.isFavorite = true
    }

    // Get images with pagination
    const [images, totalCount] = await Promise.all([
      prisma.userImage.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: { name: true, email: true }
          }
        }
      }),
      prisma.userImage.count({ where: whereClause })
    ])

    // For now, use direct URLs instead of SAS URLs to debug
    const imagesWithSasUrls = images.map((image) => ({
      ...image,
      // Temporarily use direct URLs to see if images load
      thumbnailUrl: image.thumbnailUrl || image.processedUrl,
      processedUrl: image.processedUrl,
      // Don't expose original URL in list view for security
      originalUrl: undefined
    }))

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      images: imagesWithSasUrls,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Error fetching images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    )
  }
}
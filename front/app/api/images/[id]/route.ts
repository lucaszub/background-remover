import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { azureStorage } from '@/lib/azure-storage'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const image = await prisma.userImage.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user.id
      },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    // Generate SAS URLs for all image versions
    const [originalSasUrl, processedSasUrl, thumbnailSasUrl] = await Promise.all([
      azureStorage.generateSasUrl(image.originalUrl, 2),
      azureStorage.generateSasUrl(image.processedUrl, 2),
      image.thumbnailUrl ? azureStorage.generateSasUrl(image.thumbnailUrl, 2) : null
    ])

    return NextResponse.json({
      ...image,
      originalUrl: originalSasUrl,
      processedUrl: processedSasUrl,
      thumbnailUrl: thumbnailSasUrl
    })

  } catch (error) {
    console.error('Error fetching image:', error)
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, tags, isFavorite } = body

    // Validate input
    if (title !== undefined && (typeof title !== 'string' || title.length > 255)) {
      return NextResponse.json(
        { error: 'Invalid title' },
        { status: 400 }
      )
    }

    if (tags !== undefined && (!Array.isArray(tags) || tags.some(tag => typeof tag !== 'string'))) {
      return NextResponse.json(
        { error: 'Invalid tags format' },
        { status: 400 }
      )
    }

    if (isFavorite !== undefined && typeof isFavorite !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid isFavorite value' },
        { status: 400 }
      )
    }

    // Check if image exists and belongs to user
    const resolvedParams = await params
    const existingImage = await prisma.userImage.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user.id
      }
    })

    if (!existingImage) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    // Update image
    const updatedImage = await prisma.userImage.update({
      where: { id: resolvedParams.id },
      data: {
        ...(title !== undefined && { title }),
        ...(tags !== undefined && { tags }),
        ...(isFavorite !== undefined && { isFavorite })
      },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })

    // Generate SAS URLs for response
    const [processedSasUrl, thumbnailSasUrl] = await Promise.all([
      azureStorage.generateSasUrl(updatedImage.processedUrl, 2),
      updatedImage.thumbnailUrl ? azureStorage.generateSasUrl(updatedImage.thumbnailUrl, 2) : null
    ])

    return NextResponse.json({
      ...updatedImage,
      processedUrl: processedSasUrl,
      thumbnailUrl: thumbnailSasUrl,
      originalUrl: undefined // Don't expose original URL in update response
    })

  } catch (error) {
    console.error('Error updating image:', error)
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if image exists and belongs to user
    const resolvedParams = await params
    const image = await prisma.userImage.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user.id
      }
    })

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    // Delete from Azure Blob Storage
    const extension = image.originalName.split('.').pop()?.toLowerCase() || 'jpg'
    await azureStorage.deleteImage(session.user.id, resolvedParams.id, extension)

    // Delete from database
    await prisma.userImage.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ message: 'Image deleted successfully' })

  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
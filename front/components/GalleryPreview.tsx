'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { Search, History, Trash2, Download, Maximize2, X, Images, LogIn } from 'lucide-react'
import { getImages, deleteImage, type UserImage, type ApiError } from '../lib/api'

interface GalleryPreviewProps {
  limit?: number
  onError?: (error: ApiError) => void
}

export default function GalleryPreview({ limit = 8, onError }: GalleryPreviewProps) {
  const { data: session } = useSession()
  const [images, setImages] = useState<UserImage[]>([])
  const [filteredImages, setFilteredImages] = useState<UserImage[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<UserImage | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Fetch images
  useEffect(() => {
    if (!session?.user) return

    const fetchImages = async () => {
      setLoading(true)
      try {
        const response = await getImages({
          page: 1,
          limit,
          search: searchTerm || undefined
        })
        setImages(response.images)
        setFilteredImages(response.images)
      } catch (error) {
        console.error('Error fetching images:', error)
        if (onError && error && typeof error === 'object' && 'message' in error) {
          onError(error as ApiError)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [session, limit, searchTerm, onError])

  // Filter images based on search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredImages(images)
    } else {
      const filtered = images.filter(image =>
        image.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.originalName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredImages(filtered)
    }
  }, [searchTerm, images])

  const handleDelete = async (imageId: string) => {
    try {
      await deleteImage(imageId)
      setImages(prev => prev.filter(img => img.id !== imageId))
      if (selectedImage?.id === imageId) {
        setShowModal(false)
        setSelectedImage(null)
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      if (onError && error && typeof error === 'object' && 'message' in error) {
        onError(error as ApiError)
      }
    }
  }

  const openModal = (image: UserImage) => {
    setSelectedImage(image)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedImage(null)
  }

  const downloadImage = (url: string, filename: string) => {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
  }

  // Show sign-in prompt if user is not authenticated
  if (!session?.user) {
    return (
      <section
        id="gallery"
        className="w-full animate-fade-in-up"
        style={{animationDelay: '0.7s', animationDuration: '1000ms'}}
      >
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Gallery</h2>
            <p className="text-sm text-neutral-400 mt-1">Your recently processed images.</p>
          </div>
        </div>

        {/* Sign-in prompt */}
        <div className="rounded-xl border border-neutral-800 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-8 ring-1 ring-inset ring-neutral-900 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-lg bg-blue-500/20 ring-1 ring-blue-500/30 flex items-center justify-center">
              <Images className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold mb-4">Access Your Image History</h3>
          <p className="text-neutral-400 mb-6 max-w-2xl mx-auto">
            Sign in to save your processed images, access your gallery, and keep track of your editing history.
          </p>
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
          >
            <LogIn className="h-4 w-4" />
            Sign in with Google
          </button>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Gallery Section */}
      <section
        id="gallery"
        className="w-full animate-fade-in-up"
        style={{animationDelay: '0.7s', animationDuration: '1000ms'}}
      >
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Gallery</h2>
            <p className="text-sm text-neutral-400 mt-1">Your recently processed images.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400">
              <History className="h-4 w-4" />
              <span>{images.length} {images.length === 1 ? 'image' : 'images'}</span>
                <span>{images.length} {images.length === 1 ? 'image' : 'images'}</span>
            </div>
              <button
              onClick={() => setSearchTerm('')}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs font-medium text-neutral-200 hover:bg-neutral-800/60 transition-colors"
            >
              Clear Search
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name…"
              className="w-full rounded-lg bg-neutral-950 ring-1 ring-neutral-800 focus:ring-neutral-600 outline-none pl-9 pr-3 py-2 text-sm placeholder:text-neutral-500 transition-all"
            />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="rounded-xl ring-1 ring-neutral-800 bg-neutral-900/30 animate-pulse">
                <div className="aspect-[4/3] bg-neutral-800/50" />
                <div className="p-3">
                  <div className="h-3 bg-neutral-800/50 rounded mb-2" />
                  <div className="h-2 bg-neutral-800/50 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="group relative rounded-xl overflow-hidden ring-1 ring-neutral-800 bg-neutral-900/30 hover:ring-neutral-700 transition-all cursor-pointer"
              >
                <div className="aspect-[4/3] bg-black overflow-hidden" onClick={() => openModal(image)}>
                  <img
                    src={image.processedUrl}
                    alt={image.title || image.originalName}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    onError={(e) => {
                      // Fallback to original if processed fails
                      const target = e.target as HTMLImageElement
                      target.src = image.originalUrl
                    }}
                  />
                </div>
                <div className="p-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium tracking-tight truncate">
                      {image.title || image.originalName}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        openModal(image)
                      }}
                      className="h-8 w-8 rounded-md border border-neutral-800 hover:bg-neutral-900 flex items-center justify-center transition-colors"
                      title="Preview"
                    >
                      <Maximize2 className="h-4 w-4 text-neutral-300" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        downloadImage(image.processedUrl, `${image.title || image.originalName}.png`)
                      }}
                      className="h-8 w-8 rounded-md border border-neutral-800 hover:bg-neutral-900 flex items-center justify-center transition-colors"
                      title="Download"
                    >
                      <Download className="h-4 w-4 text-neutral-300" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm('Delete this image?')) {
                          handleDelete(image.id)
                        }
                      }}
                      className="h-8 w-8 rounded-md border border-neutral-800 hover:bg-neutral-900 flex items-center justify-center transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-neutral-300" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-xl border border-dashed border-neutral-800 p-10 text-center">
            <div className="mx-auto h-12 w-12 rounded-lg bg-neutral-900 ring-1 ring-neutral-800 flex items-center justify-center">
              <Images className="h-6 w-6 text-neutral-300" />
            </div>
              <p className="mt-4 text-base font-medium tracking-tight">
              {searchTerm ? 'No images found' : 'No images in your gallery'}
            </p>
              <p className="mt-1 text-sm text-neutral-400">
              {searchTerm ? 'Try a different search term.' : 'Process an image above to get started.'}
            </p>
          </div>
        )}
      </section>

      {/* Preview Modal */}
      {showModal && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative z-10 max-w-5xl w-[92vw] rounded-2xl bg-neutral-950 ring-1 ring-neutral-800 overflow-hidden animate-fade-in-up">
            <div className="p-3 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Images className="h-4 w-4 text-neutral-400" />
                <span className="text-sm font-medium tracking-tight">
                  {selectedImage.title || selectedImage.originalName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadImage(selectedImage.processedUrl, `${selectedImage.title || selectedImage.originalName}.png`)}
                  className="inline-flex items-center gap-2 rounded-md bg-neutral-100 text-neutral-900 px-3 py-1.5 text-xs font-medium hover:bg-white transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this image?')) {
                      handleDelete(selectedImage.id)
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-200 hover:bg-neutral-800/60 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
                <button
                  onClick={closeModal}
                  className="ml-1 h-8 w-8 rounded-md border border-neutral-800 hover:bg-neutral-900 flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4 text-neutral-400" />
                </button>
              </div>
            </div>
            <div className="bg-neutral-900/20">
              <img
                src={selectedImage.processedUrl}
                alt={selectedImage.title || selectedImage.originalName}
                className="w-full max-h-[80vh] object-contain bg-black"
                onError={(e) => {
                  // Fallback to original if processed fails
                  const target = e.target as HTMLImageElement
                  target.src = selectedImage.originalUrl
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
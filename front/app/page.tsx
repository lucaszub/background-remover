'use client'

import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import ImageUpload from '../components/ImageUpload'
import ImagePreview from '../components/ImagePreview'
import Footer from '../components/Footer'
import ErrorNotification from '../components/ErrorNotification'
import GalleryPreview from '../components/GalleryPreview'
import { removeBackground, ApiError } from '../lib/api'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [originalPreview, setOriginalPreview] = useState<string | null>(null)
  const [resultPreview, setResultPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessed, setIsProcessed] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Effacer les erreurs précédentes
    setError(null)
    setSelectedFile(file)

    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      setOriginalPreview(result)
      setResultPreview(result)
      setIsProcessed(false)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return

    // Effacer les erreurs précédentes
    setError(null)
    setIsLoading(true)
    setIsProcessed(false)

    try {
      const resultBlob = await removeBackground(selectedFile)
      const resultUrl = URL.createObjectURL(resultBlob)
      setResultPreview(resultUrl)
      setIsProcessed(true)
    } catch (error) {
      console.error('Erreur lors du traitement:', error)

      // Gestion typée des erreurs
      if (error && typeof error === 'object' && 'type' in error) {
        setError(error as ApiError)
      } else {
        setError({
          message: error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite',
          type: 'error'
        })
      }

      setIsProcessed(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-masquer les erreurs après 10 secondes
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleDownload = () => {
    if (!resultPreview) return
    const a = document.createElement('a')
    a.href = resultPreview
    a.download = 'image-sans-fond.png'
    a.click()
  }

  return (
    <div className="bg-neutral-950 text-neutral-50 min-h-screen w-full flex flex-col items-center justify-start relative overflow-x-hidden">
      <Header />

      {/* Notification d'erreur */}
      <ErrorNotification
        error={error?.message || null}
        onClose={() => setError(null)}
        type={error?.type || 'error'}
      />

      {/* Content */}
      <main className="flex flex-col items-center w-full px-4 max-w-3xl mx-auto pt-10 pb-24">
        <Hero />

        <ImageUpload
          selectedFile={selectedFile}
          onFileChange={handleFileChange}
          onSubmit={handleSubmit}
        />

        {/* Divider */}
        <div
          className="w-full h-px bg-neutral-800 my-10 animate-fade-in-up"
          style={{animationDelay: '0.45s', animationDuration: '1000ms'}}
        ></div>

        <ImagePreview
          originalPreview={originalPreview}
          resultPreview={resultPreview}
          isLoading={isLoading}
          isProcessed={isProcessed}
          onDownload={handleDownload}
        />

        {/* Divider */}
        <div
          className="w-full h-px bg-neutral-800 my-10 animate-fade-in-up"
          style={{animationDelay: '0.65s', animationDuration: '1000ms'}}
        ></div>

        {/* Gallery Preview */}
        <GalleryPreview
          limit={8}
          onError={setError}
        />
      </main>

      <Footer />
    </div>
  )
}

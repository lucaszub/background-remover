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
import Link from 'next/link'
import { Mail, ExternalLink } from 'lucide-react'

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

    // Clear previous errors
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

    // Clear previous errors
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

  // Auto-hide errors after 10 seconds
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
    a.download = 'background-removed.png'
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

        {/* Divider */}
        <div
          className="w-full h-px bg-neutral-800 my-10 animate-fade-in-up"
          style={{animationDelay: '0.8s', animationDuration: '1000ms'}}
        ></div>

        {/* Contact CTA */}
        <section
          className="w-full animate-fade-in-up"
          style={{animationDelay: '0.85s', animationDuration: '1000ms'}}
        >
          <div className="rounded-xl border border-neutral-800 bg-gradient-to-r from-teal-500/10 to-blue-500/10 p-8 ring-1 ring-inset ring-neutral-900 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-lg bg-teal-500/20 ring-1 ring-teal-500/30 flex items-center justify-center">
                <Mail className="h-6 w-6 text-teal-400" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Want More Features?</h3>
            <p className="text-neutral-400 mb-6 max-w-2xl mx-auto">
              Interested in custom integrations, bulk processing, or enterprise features?
              Let&apos;s discuss how we can enhance this tool for your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
              >
                <Mail className="h-4 w-4" />
                Discuss Collaboration
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-neutral-200 font-medium py-3 px-6 rounded-lg transition-all duration-200"
              >
                <ExternalLink className="h-4 w-4" />
                View Technical Details
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

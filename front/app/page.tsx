'use client'

import { useState } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import ImageUpload from '../components/ImageUpload'
import ImagePreview from '../components/ImagePreview'
import Footer from '../components/Footer'
import { removeBackground } from '../lib/api'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [originalPreview, setOriginalPreview] = useState<string | null>(null)
  const [resultPreview, setResultPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessed, setIsProcessed] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

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

    setIsLoading(true)
    setIsProcessed(false)
    
    try {
      const resultBlob = await removeBackground(selectedFile)
      const resultUrl = URL.createObjectURL(resultBlob)
      setResultPreview(resultUrl)
      setIsProcessed(true)
    } catch (error) {
      console.error('Erreur lors du traitement:', error)
      // Fallback: garder l'image originale en cas d'erreur
      setIsProcessed(false)
    } finally {
      setIsLoading(false)
    }
  }

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
      </main>

      <Footer />
    </div>
  )
}

'use client'

import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="bg-neutral-950 text-neutral-50 min-h-screen w-full flex flex-col items-center justify-start relative overflow-x-hidden">
      <Header />

      <main className="flex flex-col items-center w-full px-4 max-w-4xl mx-auto pt-20 pb-24">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
          <p className="text-neutral-400 mb-8 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-neutral-200 font-medium py-3 px-6 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
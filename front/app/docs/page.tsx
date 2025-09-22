'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { Sparkles, Upload, Download, Zap, Shield, Clock, Users, Star, CheckCircle, ArrowLeft } from 'lucide-react'

export default function DocsPage() {
  return (
    <div className="bg-neutral-950 text-neutral-50 min-h-screen w-full flex flex-col items-center justify-start relative overflow-x-hidden">
      <Header />

      <main className="flex flex-col items-center w-full px-4 max-w-4xl mx-auto pt-10 pb-24">
        {/* Back to Home Link */}
        <div
          className="w-full mb-8 animate-fade-in-up"
          style={{animationDelay: '0.05s', animationDuration: '800ms'}}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-200 transition-colors text-sm font-medium group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>

        {/* Hero Section */}
        <div
          className="text-center mb-16 animate-fade-in-up"
          style={{animationDelay: '0.1s', animationDuration: '1000ms'}}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-6">
            Background Remover{' '}
            <span className="bg-gradient-to-r from-teal-400 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
              Documentation
            </span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Discover how our AI-powered background removal tool transforms your images
            with professional results in seconds.
          </p>
        </div>

        {/* Core Concepts */}
        <section
          className="w-full mb-16 animate-fade-in-up"
          style={{animationDelay: '0.2s', animationDuration: '1000ms'}}
        >
          <h2 className="text-3xl font-semibold tracking-tight mb-8 text-center">
            Core Concepts
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 ring-1 ring-inset ring-neutral-900">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-teal-500/20 ring-1 ring-teal-500/30 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-teal-400" />
                </div>
                <h3 className="text-xl font-semibold">AI-Powered Processing</h3>
              </div>
              <p className="text-neutral-400 leading-relaxed">
                Our advanced machine learning model automatically detects subjects and removes backgrounds
                with pixel-perfect precision, handling complex edges and fine details like hair and fur.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 ring-1 ring-inset ring-neutral-900">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-blue-500/20 ring-1 ring-blue-500/30 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold">Instant Results</h3>
              </div>
              <p className="text-neutral-400 leading-relaxed">
                Process images in seconds, not minutes. Our optimized infrastructure ensures fast processing
                times while maintaining the highest quality output for professional use.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 ring-1 ring-inset ring-neutral-900">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-fuchsia-500/20 ring-1 ring-fuchsia-500/30 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-fuchsia-400" />
                </div>
                <h3 className="text-xl font-semibold">Privacy & Security</h3>
              </div>
              <p className="text-neutral-400 leading-relaxed">
                Your images are processed securely and never stored permanently on our servers.
                All processing happens in isolated environments with enterprise-grade security.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 ring-1 ring-inset ring-neutral-900">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/20 ring-1 ring-emerald-500/30 flex items-center justify-center">
                  <Users className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold">User Management</h3>
              </div>
              <p className="text-neutral-400 leading-relaxed">
                Create an account to access your personal gallery, track usage quotas, and manage
                your processed images with advanced organization features.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          className="w-full mb-16 animate-fade-in-up"
          style={{animationDelay: '0.3s', animationDuration: '1000ms'}}
        >
          <h2 className="text-3xl font-semibold tracking-tight mb-8 text-center">
            How It Works
          </h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-teal-500 text-neutral-950 font-semibold flex items-center justify-center text-sm mt-1">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Upload className="h-5 w-5 text-teal-400" />
                  Upload Your Image
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  Drag and drop or click to upload your image. We support JPEG, PNG, and WebP formats
                  up to 10MB. Our system will automatically validate and optimize your image for processing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-blue-500 text-neutral-950 font-semibold flex items-center justify-center text-sm mt-1">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-400" />
                  AI Processing
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  Our advanced AI model analyzes your image, identifies the main subject, and precisely
                  separates it from the background. This process typically takes just a few seconds.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-fuchsia-500 text-neutral-950 font-semibold flex items-center justify-center text-sm mt-1">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Download className="h-5 w-5 text-fuchsia-400" />
                  Download & Save
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  Download your processed image with a transparent background as a PNG file.
                  Authenticated users can also save images to their personal gallery for future access.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          className="w-full mb-16 animate-fade-in-up"
          style={{animationDelay: '0.4s', animationDuration: '1000ms'}}
        >
          <h2 className="text-3xl font-semibold tracking-tight mb-8 text-center">
            Key Features
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-lg border border-neutral-800 bg-neutral-950/30 p-4">
              <CheckCircle className="h-6 w-6 text-emerald-400 mb-3" />
              <h3 className="font-semibold mb-2">High-Quality Output</h3>
              <p className="text-sm text-neutral-400">
                Professional-grade results with precise edge detection
              </p>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-950/30 p-4">
              <Clock className="h-6 w-6 text-blue-400 mb-3" />
              <h3 className="font-semibold mb-2">Fast Processing</h3>
              <p className="text-sm text-neutral-400">
                Get results in seconds with optimized infrastructure
              </p>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-950/30 p-4">
              <Users className="h-6 w-6 text-fuchsia-400 mb-3" />
              <h3 className="font-semibold mb-2">Personal Gallery</h3>
              <p className="text-sm text-neutral-400">
                Save and organize your processed images
              </p>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-950/30 p-4">
              <Shield className="h-6 w-6 text-teal-400 mb-3" />
              <h3 className="font-semibold mb-2">Secure Processing</h3>
              <p className="text-sm text-neutral-400">
                Your privacy is protected with secure cloud processing
              </p>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-950/30 p-4">
              <Star className="h-6 w-6 text-yellow-400 mb-3" />
              <h3 className="font-semibold mb-2">Multiple Formats</h3>
              <p className="text-sm text-neutral-400">
                Support for JPEG, PNG, and WebP input formats
              </p>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-950/30 p-4">
              <Zap className="h-6 w-6 text-orange-400 mb-3" />
              <h3 className="font-semibold mb-2">Quota Management</h3>
              <p className="text-sm text-neutral-400">
                Fair usage limits with real-time quota tracking
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          className="w-full animate-fade-in-up"
          style={{animationDelay: '0.5s', animationDuration: '1000ms'}}
        >
          <h2 className="text-3xl font-semibold tracking-tight mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 ring-1 ring-inset ring-neutral-900">
              <h3 className="text-lg font-semibold mb-3">What image formats are supported?</h3>
              <p className="text-neutral-400 leading-relaxed">
                We support JPEG, PNG, and WebP formats with a maximum file size of 10MB.
                The output is always provided as a PNG file with a transparent background.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 ring-1 ring-inset ring-neutral-900">
              <h3 className="text-lg font-semibold mb-3">Do I need to create an account?</h3>
              <p className="text-neutral-400 leading-relaxed">
                No account is required for basic usage. Anonymous users can process up to 5 images per day.
                Creating an account gives you 20 images per day and access to your personal gallery.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 ring-1 ring-inset ring-neutral-900">
              <h3 className="text-lg font-semibold mb-3">How long are images stored?</h3>
              <p className="text-neutral-400 leading-relaxed">
                For authenticated users, images are stored in your personal gallery indefinitely until you choose to delete them.
                Anonymous uploads are processed and returned immediately without storage.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 ring-1 ring-inset ring-neutral-900">
              <h3 className="text-lg font-semibold mb-3">Is my data secure?</h3>
              <p className="text-neutral-400 leading-relaxed">
                Yes, we take privacy seriously. All images are processed in secure, isolated environments.
                We use enterprise-grade security and never share your images with third parties.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
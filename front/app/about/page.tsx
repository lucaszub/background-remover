'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import {
  ArrowLeft,
  Code2,
  Database,
  Cloud,
  Zap,
  Shield,
  GitBranch,
  Server,
  Brain,
  FileText,
  Users,
  ChevronRight,
  ExternalLink,
  Mail
} from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="bg-neutral-950 text-neutral-50 min-h-screen w-full flex flex-col items-center justify-start relative overflow-x-hidden">
      <Header />

      <main className="flex flex-col items-center w-full px-4 max-w-5xl mx-auto pt-10 pb-24">
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
            Project{' '}
            <span className="bg-gradient-to-r from-teal-400 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
              Architecture
            </span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
            A comprehensive look at the technical decisions, architecture patterns, and development process
            behind this AI-powered background removal application.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-neutral-900/60 border border-neutral-800 ring-1 ring-neutral-800">
            <FileText className="h-5 w-5 text-teal-400" />
            <span className="text-sm font-medium">Portfolio Project • Full-Stack Development</span>
          </div>
        </div>

        {/* Technical Overview */}
        <section
          className="w-full mb-16 animate-fade-in-up"
          style={{animationDelay: '0.2s', animationDuration: '1000ms'}}
        >
          <h2 className="text-3xl font-semibold tracking-tight mb-8">Technical Overview</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 ring-1 ring-inset ring-neutral-900">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-blue-500/20 ring-1 ring-blue-500/30 flex items-center justify-center">
                  <Code2 className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold">Modern Full-Stack</h3>
              </div>
              <p className="text-neutral-400 leading-relaxed mb-4">
                Built with Next.js 15, TypeScript, and Tailwind CSS 4 for the frontend, FastAPI with Python for AI processing,
                showcasing modern development practices and cutting-edge technologies.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Next.js 15', 'TypeScript', 'Tailwind CSS 4', 'FastAPI', 'Python'].map(tech => (
                  <span key={tech} className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 ring-1 ring-inset ring-neutral-900">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/20 ring-1 ring-emerald-500/30 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold">AI Integration</h3>
              </div>
              <p className="text-neutral-400 leading-relaxed mb-4">
                Implements the rembg machine learning model for background removal, demonstrating AI/ML integration
                in a production web application with real-time processing capabilities.
              </p>
              <div className="flex flex-wrap gap-2">
                {['rembg 2.0.50', 'ML Pipeline', 'Image Processing', 'Real-time AI'].map(tech => (
                  <span key={tech} className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Architecture Diagram */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-8 ring-1 ring-inset ring-neutral-900">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Server className="h-6 w-6 text-teal-400" />
              System Architecture
            </h3>
            <div className="bg-neutral-900/60 rounded-lg p-6 font-mono text-sm text-neutral-300 overflow-x-auto">
              <pre className="whitespace-pre">
{`┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Next.js API   │    │                 │
│   (Vercel)      │───▶│   Routes        │───▶│  Hostinger VPS  │
│   • Next.js 15  │    │   • Auth        │    │   (KVM1)        │
│   • TypeScript  │    │   • Quotas      │    │                 │
│   • Tailwind    │    │   • Azure SDK   │    │  ┌─────────────┐ │
│   • NextAuth    │    │   • SAS URLs    │    │  │  FastAPI    │ │
└─────────────────┘    └─────────────────┘    │  │ • rembg AI  │ │
                                │             │  │ • Processing│ │
                                │             │  │ • Endpoints │ │
                                │             │  └─────────────┘ │
                                │             │         │        │
                                │             │  ┌─────────────┐ │
                                └─────────────┼─▶│ PostgreSQL  │ │
                                              │  │ (Docker)    │ │
                                              │  │ • Users     │ │
                                              │  │ • Quotas    │ │
                                              │  │ • Images    │ │
                                              │  └─────────────┘ │
                                              └─────────────────┘
                                │                      │
                                │                      ▼
                                │             ┌─────────────────┐
                                └─────────────│   Azure Blob    │
                                              │   Storage       │
    Data Flow:                                │   • Images      │
    1. Frontend ───▶ API Routes               │   • Secure SAS  │
    2. API Routes ──▶ FastAPI (processing)    │   • CDN Ready   │
    3. API Routes ──▶ Azure (storage)         └─────────────────┘
    4. API Routes ──▶ Frontend (SAS URLs)`}
              </pre>
            </div>
          </div>
        </section>

        {/* Key Technical Decisions */}
        <section
          className="w-full mb-16 animate-fade-in-up"
          style={{animationDelay: '0.3s', animationDuration: '1000ms'}}
        >
          <h2 className="text-3xl font-semibold tracking-tight mb-8">Key Technical Decisions</h2>

          <div className="space-y-6">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 ring-1 ring-inset ring-neutral-900">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <ChevronRight className="h-5 w-5 text-teal-400" />
                Architecture Pattern: API Proxy Design
              </h3>
              <p className="text-neutral-400 leading-relaxed mb-3">
                <strong className="text-neutral-200">Decision:</strong> Use Next.js API routes as middleware between frontend and FastAPI
              </p>
              <p className="text-neutral-400 leading-relaxed mb-3">
                <strong className="text-neutral-200">Rationale:</strong> Separates concerns, allows for authentication/quota management in Next.js while keeping ML processing isolated in FastAPI. Provides better security and scalability.
              </p>
              <p className="text-neutral-400 leading-relaxed">
                <strong className="text-neutral-200">Benefits:</strong> Clean separation, easier testing, independent scaling, security layers
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 ring-1 ring-inset ring-neutral-900">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <ChevronRight className="h-5 w-5 text-blue-400" />
                Database Strategy: PostgreSQL + Prisma ORM
              </h3>
              <p className="text-neutral-400 leading-relaxed mb-3">
                <strong className="text-neutral-200">Decision:</strong> PostgreSQL with Prisma for type-safe database operations
              </p>
              <p className="text-neutral-400 leading-relaxed mb-3">
                <strong className="text-neutral-200">Rationale:</strong> Robust ACID compliance for user data, excellent TypeScript integration, migration management, and production-ready performance.
              </p>
              <p className="text-neutral-400 leading-relaxed">
                <strong className="text-neutral-200">Implementation:</strong> User management, quota tracking, image metadata, audit trails
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 ring-1 ring-inset ring-neutral-900">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <ChevronRight className="h-5 w-5 text-fuchsia-400" />
                Authentication: NextAuth.js with Google OAuth
              </h3>
              <p className="text-neutral-400 leading-relaxed mb-3">
                <strong className="text-neutral-200">Decision:</strong> Social authentication with session management
              </p>
              <p className="text-neutral-400 leading-relaxed mb-3">
                <strong className="text-neutral-200">Rationale:</strong> Reduces friction for users, industry-standard security, handles complex OAuth flows, supports multiple providers.
              </p>
              <p className="text-neutral-400 leading-relaxed">
                <strong className="text-neutral-200">Features:</strong> Anonymous usage, authenticated galleries, quota management
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 ring-1 ring-inset ring-neutral-900">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <ChevronRight className="h-5 w-5 text-emerald-400" />
                Deployment: Strategic Multi-Cloud Architecture
              </h3>
              <p className="text-neutral-400 leading-relaxed mb-3">
                <strong className="text-neutral-200">Decision:</strong> Vercel (frontend) + Hostinger VPS (backend+database) + Azure (storage)
              </p>
              <p className="text-neutral-400 leading-relaxed mb-3">
                <strong className="text-neutral-200">Rationale:</strong> FastAPI + PostgreSQL co-located on VPS for performance, Azure storage accessed only through API routes for security, frontend never directly accesses storage. Cost-effective while maintaining security best practices.
              </p>
              <p className="text-neutral-400 leading-relaxed">
                <strong className="text-neutral-200">Benefits:</strong> Secure access control, SAS URL generation, low latency (co-located services), centralized authentication, audit trails
              </p>
            </div>
          </div>
        </section>

        {/* Skills Demonstrated */}
        <section
          className="w-full mb-16 animate-fade-in-up"
          style={{animationDelay: '0.4s', animationDuration: '1000ms'}}
        >
          <h2 className="text-3xl font-semibold tracking-tight mb-8">Skills Demonstrated</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-lg border border-neutral-800 bg-neutral-950/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Code2 className="h-6 w-6 text-blue-400" />
                <h3 className="font-semibold">Frontend Development</h3>
              </div>
              <ul className="text-sm text-neutral-400 space-y-2">
                <li>• Modern React with Hooks</li>
                <li>• TypeScript for type safety</li>
                <li>• Responsive design patterns</li>
                <li>• State management</li>
                <li>• Component architecture</li>
              </ul>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-950/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Server className="h-6 w-6 text-emerald-400" />
                <h3 className="font-semibold">Backend Development</h3>
              </div>
              <ul className="text-sm text-neutral-400 space-y-2">
                <li>• REST API design</li>
                <li>• Python/FastAPI expertise</li>
                <li>• Authentication systems</li>
                <li>• File processing</li>
                <li>• Error handling</li>
              </ul>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-950/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="h-6 w-6 text-fuchsia-400" />
                <h3 className="font-semibold">Database Design</h3>
              </div>
              <ul className="text-sm text-neutral-400 space-y-2">
                <li>• Schema design</li>
                <li>• Relationships & indexing</li>
                <li>• Migration management</li>
                <li>• Query optimization</li>
                <li>• Data modeling</li>
              </ul>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-950/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Cloud className="h-6 w-6 text-teal-400" />
                <h3 className="font-semibold">Cloud & DevOps</h3>
              </div>
              <ul className="text-sm text-neutral-400 space-y-2">
                <li>• Multi-cloud deployment</li>
                <li>• Docker containerization</li>
                <li>• VPS management</li>
                <li>• CI/CD practices</li>
                <li>• Monitoring & logs</li>
              </ul>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-950/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="h-6 w-6 text-orange-400" />
                <h3 className="font-semibold">AI/ML Integration</h3>
              </div>
              <ul className="text-sm text-neutral-400 space-y-2">
                <li>• Model integration</li>
                <li>• Image processing</li>
                <li>• Performance optimization</li>
                <li>• Error handling</li>
                <li>• Real-time processing</li>
              </ul>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-950/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-red-400" />
                <h3 className="font-semibold">Security & Performance</h3>
              </div>
              <ul className="text-sm text-neutral-400 space-y-2">
                <li>• Authentication flows</li>
                <li>• API security</li>
                <li>• Rate limiting</li>
                <li>• Data validation</li>
                <li>• Performance optimization</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Development Process */}
        <section
          className="w-full mb-16 animate-fade-in-up"
          style={{animationDelay: '0.5s', animationDuration: '1000ms'}}
        >
          <h2 className="text-3xl font-semibold tracking-tight mb-8">Development Process</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 ring-1 ring-inset ring-neutral-900">
              <div className="flex items-center gap-3 mb-4">
                <GitBranch className="h-6 w-6 text-teal-400" />
                <h3 className="text-xl font-semibold">Development Methodology</h3>
              </div>
              <ul className="text-neutral-400 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-teal-400 mt-2"></span>
                  <span><strong>Co-located Architecture:</strong> FastAPI + PostgreSQL on same VPS for optimal performance</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-blue-400 mt-2"></span>
                  <span><strong>API-First Design:</strong> Clean separation between ML processing and business logic</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-fuchsia-400 mt-2"></span>
                  <span><strong>Docker Deployment:</strong> Containerized PostgreSQL with persistent volumes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 mt-2"></span>
                  <span><strong>Production-Ready:</strong> VPS automation scripts, error handling, monitoring</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 ring-1 ring-inset ring-neutral-900">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-6 w-6 text-yellow-400" />
                <h3 className="text-xl font-semibold">Performance Optimizations</h3>
              </div>
              <ul className="text-neutral-400 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-yellow-400 mt-2"></span>
                  <span><strong>Image Processing:</strong> Optimized ML pipeline with caching</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-orange-400 mt-2"></span>
                  <span><strong>Database Queries:</strong> Indexed queries and connection pooling</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-red-400 mt-2"></span>
                  <span><strong>Frontend:</strong> Code splitting and lazy loading</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-purple-400 mt-2"></span>
                  <span><strong>CDN Integration:</strong> Azure Blob Storage with SAS URLs</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section
          className="w-full animate-fade-in-up"
          style={{animationDelay: '0.6s', animationDuration: '1000ms'}}
        >
          <h2 className="text-3xl font-semibold tracking-tight mb-8">Project Evolution</h2>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-8 ring-1 ring-inset ring-neutral-900">
            <p className="text-neutral-400 leading-relaxed mb-6">
              This project serves as a comprehensive demonstration of modern full-stack development skills,
              showcasing proficiency in current industry technologies and best practices. The architecture
              is designed to be scalable and maintainable, suitable for both portfolio demonstration and
              potential production deployment.
            </p>

            <div className="border-t border-neutral-800 pt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-teal-400" />
                Potential Enhancements
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p className="text-neutral-300">• Advanced AI models integration</p>
                  <p className="text-neutral-300">• Real-time collaboration features</p>
                  <p className="text-neutral-300">• Advanced image editing tools</p>
                </div>
                <div className="space-y-2">
                  <p className="text-neutral-300">• Premium subscription tiers</p>
                  <p className="text-neutral-300">• Batch processing capabilities</p>
                  <p className="text-neutral-300">• Enterprise API access</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-800">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-medium text-neutral-200">Interested in the technical details?</h4>
                  <p className="text-sm text-neutral-400">View the complete source code and documentation</p>
                </div>
                <div className="flex gap-3">
                  <a
                    href="https://github.com/lucaszub/background-remover"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    GitHub
                  </a>
                  <Link
                    href="/docs"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 transition-colors text-sm"
                  >
                    <FileText className="h-4 w-4" />
                    Documentation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section
          className="w-full animate-fade-in-up"
          style={{animationDelay: '0.7s', animationDuration: '1000ms'}}
        >
          <div className="rounded-xl border border-neutral-800 bg-gradient-to-r from-teal-500/10 to-blue-500/10 p-8 ring-1 ring-inset ring-neutral-900 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-lg bg-teal-500/20 ring-1 ring-teal-500/30 flex items-center justify-center">
                <Mail className="h-6 w-6 text-teal-400" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Let&apos;s Connect!</h3>
            <p className="text-neutral-400 mb-6 max-w-2xl mx-auto">
              Interested in collaborating on a project? Have questions about this implementation?
              I&apos;d love to discuss development opportunities and technical challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
              >
                <Mail className="h-4 w-4" />
                Get In Touch
              </Link>
              <a
                href="mailto:zubiarrainlucas@gmail.com"
                className="inline-flex items-center gap-2 border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-neutral-200 font-medium py-3 px-6 rounded-lg transition-all duration-200"
              >
                <ExternalLink className="h-4 w-4" />
                Direct Email
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
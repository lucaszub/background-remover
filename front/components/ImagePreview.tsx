import { Download, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImagePreviewProps {
  originalPreview: string | null
  resultPreview: string | null
  isLoading: boolean
  isProcessed: boolean
  onDownload: () => void
}

export default function ImagePreview({
  originalPreview,
  resultPreview,
  isLoading,
  isProcessed,
  onDownload
}: ImagePreviewProps) {
  return (
    <section
      className="flex flex-col md:flex-row gap-8 w-full justify-center animate-fade-in-up"
      style={{animationDelay: '0.5s', animationDuration: '1000ms'}}
    >
      {/* Original Image */}
      <div className="flex flex-col items-center w-full md:w-1/2 gap-2">
        <div className={`relative rounded-xl overflow-hidden border bg-neutral-900 flex items-center justify-center w-full aspect-square min-h-[220px] max-h-72 transition-all duration-500 ${
          isLoading ? 'border-neutral-600 opacity-60' : 'border-neutral-800'
        }`}>
          {originalPreview ? (
            <Image
              src={originalPreview}
              alt="Image originale"
              fill
              className={`object-cover transition-all duration-500 ${
                  isLoading ? 'opacity-60' : ''
              }`}
            />
          ) : (
            <Image
              src="/car-2.jpg"
                alt="Example image"
              fill
              className={`object-cover transition-all duration-500 ${
                isLoading ? 'opacity-60 blur-sm' : 'blur-0'
              }`}
            />
          )}

          {/* Indicateur de traitement sur l'image originale */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950/30 backdrop-blur-[1px]">
              <div className="text-neutral-300 text-sm font-medium mb-2">
                Traitement en cours...
              </div>
              <div className="text-neutral-400 text-xs text-center px-4">
          ↓ Look at the image below ↓
              </div>
            </div>
          )}
        </div>
        <span className="text-neutral-400 text-xs mt-2">Image originale</span>
      </div>

      {/* Result Image */}
      <div className="flex flex-col items-center w-full md:w-1/2 gap-2">
        <div className={`relative rounded-xl overflow-hidden border bg-neutral-900 flex items-center justify-center w-full aspect-square min-h-[220px] max-h-72 transition-all duration-500 ${
          isLoading ? 'border-blue-500 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/20' : 'border-blue-700'
        }`}>
          {resultPreview ? (
            <Image
              src={resultPreview}
              alt="Image sans fond"
              fill
              className={`object-cover transition-all duration-500 ${
                !isProcessed && originalPreview ? 'blur-sm opacity-80' : ''
              }`}
              style={{
                background: isProcessed ? 'repeating-conic-gradient(#2c2c33 0% 25%, transparent 0% 50%) 50% / 20px 20px' : undefined
              }}
            />
          ) : (
            <Image
              src="/image-sans-fond.png"
              alt="Image exemple"
              fill
              className="object-cover transition-all duration-500 blur-sm opacity-80"
              style={{background: 'repeating-conic-gradient(#2c2c33 0% 25%, transparent 0% 50%) 50% / 20px 20px'}}
            />
          )}

          {/* Loader amélioré */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950/85 backdrop-blur-sm z-10">
              <Loader2 className="w-10 h-10 text-blue-400 animate-spin mb-3" />
              <div className="text-blue-300 text-sm font-medium mb-1">
          AI in action...
              </div>
              <div className="text-blue-400 text-xs text-center px-4">
          Background removal
              </div>
            </div>
          )}
        </div>
        <span className={`text-xs mt-2 transition-colors duration-300 ${
          isLoading ? 'text-blue-400 font-medium' : 'text-neutral-400'
        }`}>
        {isLoading ? 'Processing...' : 'Background removed (AI)'}
        </span>
        <button
          onClick={onDownload}
          disabled={!isProcessed}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 hover:bg-blue-700 hover:border-blue-700 transition-colors rounded-lg font-semibold text-base shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-400 mt-2 disabled:opacity-40 disabled:pointer-events-none"
        >
          <Download className="w-5 h-5" />
        Télécharger
        </button>
      </div>
    </section>
  )
}
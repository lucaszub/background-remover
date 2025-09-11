import { Download, Loader2 } from 'lucide-react'

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
        <div className="rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 flex items-center justify-center w-full aspect-square min-h-[220px] max-h-72">
          {originalPreview ? (
            <img
              src={originalPreview}
              alt="Image originale"
              className="object-cover w-full h-full transition-all duration-500"
            />
          ) : (
            <img
              src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=400&q=80"
              alt="Image exemple"
              className="object-cover w-full h-full transition-all duration-500 blur-0"
            />
          )}
        </div>
        <span className="text-neutral-400 text-xs mt-2">Image originale</span>
      </div>

      {/* Result Image */}
      <div className="flex flex-col items-center w-full md:w-1/2 gap-2">
        <div className="relative rounded-xl overflow-hidden border border-blue-700 bg-neutral-900 flex items-center justify-center w-full aspect-square min-h-[220px] max-h-72">
          {resultPreview ? (
            <img
              src={resultPreview}
              alt="Image sans fond"
              className={`object-cover w-full h-full transition-all duration-500 ${
                !isProcessed && originalPreview ? 'blur-sm opacity-80' : ''
              }`}
              style={{
                background: isProcessed ? 'repeating-conic-gradient(#2c2c33 0% 25%, transparent 0% 50%) 50% / 20px 20px' : undefined
              }}
            />
          ) : (
            <img
              src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=400&q=80"
              alt="Image exemple"
              className="object-cover w-full h-full transition-all duration-500 blur-sm opacity-80"
              style={{background: 'repeating-conic-gradient(#2c2c33 0% 25%, transparent 0% 50%) 50% / 20px 20px'}}
            />
          )}

          {/* Loader */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm z-10">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
          )}
        </div>
        <span className="text-neutral-400 text-xs mt-2">Fond retiré (IA)</span>
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
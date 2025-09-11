import { Image, Sparkles } from 'lucide-react'

interface ImageUploadProps {
  selectedFile: File | null
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
}

export default function ImageUpload({ selectedFile, onFileChange, onSubmit }: ImageUploadProps) {
  return (
    <form 
      onSubmit={onSubmit}
      className="w-full flex flex-col items-center gap-4 animate-fade-in-up" 
      style={{animationDelay: '0.28s', animationDuration: '1000ms'}}
    >
      <label 
        htmlFor="fileInput" 
        className="group relative flex flex-col items-center justify-center w-full max-w-md h-48 border-2 border-dashed border-neutral-800 rounded-xl cursor-pointer transition-colors hover:border-blue-600 hover:bg-neutral-900 outline-none focus-within:border-blue-500"
      >
        <div className="flex flex-col items-center gap-3">
          <Image className="w-10 h-10 text-blue-400 group-hover:text-blue-500 transition-colors" />
          <span className="text-neutral-100 font-semibold text-lg group-hover:text-blue-400 transition-colors">
            Importez votre image
          </span>
          <span className="text-neutral-400 text-xs">JPEG, PNG, jusqu&apos;à 10 Mo</span>
        </div>
        <input
          id="fileInput"
          name="file"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>
      <button 
        type="submit"
        disabled={!selectedFile}
        className="flex items-center gap-2 px-5 py-2 mt-2 bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg font-semibold text-base shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-400 animate-fade-in-up disabled:opacity-50 disabled:cursor-not-allowed" 
        style={{animationDelay: '0.35s', animationDuration: '1000ms'}}
      >
        <Sparkles className="w-5 h-5" />
        Retirer le fond
      </button>
    </form>
  )
}
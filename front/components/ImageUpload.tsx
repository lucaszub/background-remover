import { Image, Sparkles } from "lucide-react";
import { useQuotas } from "../hooks/useQuotas";
import { QuotaDisplay } from "./QuotaDisplay";

interface ImageUploadProps {
  selectedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function ImageUpload({
  selectedFile,
  onFileChange,
  onSubmit,
}: ImageUploadProps) {
  const { usage, limit, isLoading, isAuthenticated, quotaMessage, refresh, canUpload, remaining } =
    useQuotas();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérifier les quotas avant de soumettre
    if (!canUpload) {
      return;
    }

    try {
      await onSubmit(e);
      refresh(); // Met à jour le quota après upload
    } catch {
      // ...gestion d'erreur éventuelle...
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div className="w-full max-w-md">
        {isLoading ? (
          <div className="h-6 bg-neutral-200 animate-pulse rounded" />
        ) : (
          <QuotaDisplay
            usage={usage}
            limit={limit}
            isAuthenticated={isAuthenticated}
          />
        )}
        <p className="text-xs text-neutral-400 mt-1">{quotaMessage}</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center gap-4 animate-fade-in-up"
        style={{ animationDelay: "0.28s", animationDuration: "1000ms" }}
      >
        <label
          htmlFor="fileInput"
          className="group relative flex flex-col items-center justify-center w-full max-w-md h-48 border-2 border-dashed border-neutral-800 rounded-xl cursor-pointer transition-colors hover:border-blue-600 hover:bg-neutral-900 outline-none focus-within:border-blue-500"
        >
          <div className="flex flex-col items-center gap-3">
            <Image className="w-10 h-10 text-blue-400 group-hover:text-blue-500 transition-colors" />
            <span className="text-neutral-100 font-semibold text-lg group-hover:text-blue-400 transition-colors">
                Upload your image
            </span>
            <span className="text-neutral-400 text-xs">
                JPEG, PNG, up to 10MB
            </span>
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
          disabled={!selectedFile || !canUpload}
          className="flex items-center gap-2 px-5 py-2 mt-2 bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg font-semibold text-base shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-400 animate-fade-in-up disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ animationDelay: "0.35s", animationDuration: "1000ms" }}
        >
          <Sparkles className="w-5 h-5" />
            {!canUpload ? "Quota exceeded" : "Remove the background"}
        </button>

        {/* Message d'avertissement quand les quotas sont pleins */}
        {!canUpload && !isLoading && (
          <div className="w-full max-w-md mt-2 p-3 bg-orange-900/50 border border-orange-700 rounded-lg">
            <p className="text-orange-200 text-sm font-medium">
            Remove the background
            </p>
            <p className="text-orange-300 text-xs mt-1">
              {isAuthenticated
                ? "Revenez demain pour plus d'utilisations gratuites"
                : "Connectez-vous pour obtenir plus d'utilisations ou revenez demain"
              }
            </p>
          </div>
        )}

        {/* Message d'avertissement quand il reste peu d'utilisations */}
        {canUpload && remaining <= 2 && remaining > 0 && !isLoading && (
          <div className="w-full max-w-md mt-2 p-3 bg-yellow-900/50 border border-yellow-700 rounded-lg">
            <p className="text-yellow-200 text-sm font-medium">
              ⚠️ Plus que {remaining} utilisation{remaining > 1 ? 's' : ''} restante{remaining > 1 ? 's' : ''}
            </p>
            <p className="text-yellow-300 text-xs mt-1">
              {!isAuthenticated && "Connectez-vous pour obtenir plus d'utilisations gratuites"}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}

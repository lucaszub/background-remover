"use client";

import { type UserImage } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

interface ImageCardProps {
  image: UserImage;
  onClick: () => void;
}

export default function ImageCard({ image, onClick }: ImageCardProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown date";
    }
  };

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 hover:border-neutral-600 transition-all duration-200 hover:scale-[1.02]"
    >
      {/* Image Preview */}
      <div className="aspect-square relative bg-neutral-800 overflow-hidden">
        <img
          src={image.thumbnailUrl || image.processedUrl}
          alt={image.title || image.originalName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />

        {/* Overlay with favorite indicator */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200">
          {image.isFavorite && (
            <div className="absolute top-2 right-2">
              <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
          )}
        </div>

        {/* Processing time badge */}
        {image.processingTime && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {(image.processingTime / 1000).toFixed(1)}s
          </div>
        )}
      </div>

      {/* Image Info */}
      <div className="p-4">
        <h3 className="text-white font-medium truncate mb-1">
          {image.title || image.originalName}
        </h3>

        <div className="text-neutral-400 text-sm space-y-1">
          <div className="flex justify-between items-center">
            <span>{formatFileSize(image.fileSize)}</span>
            <span className="text-xs">{formatDate(image.createdAt)}</span>
          </div>

          {image.dimensions && (
            <div className="text-xs">
              {image.dimensions.width} × {image.dimensions.height}
            </div>
          )}

          {image.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {image.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="bg-neutral-800 text-neutral-300 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {image.tags.length > 2 && (
                <span className="text-neutral-500 text-xs">
                  +{image.tags.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
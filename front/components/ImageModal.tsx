"use client";

import { useState } from "react";
import { type UserImage, updateImage, deleteImage } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

interface ImageModalProps {
  image: UserImage;
  onClose: () => void;
  onUpdate: (updatedImage: UserImage) => void;
  onDelete: (imageId: string) => void;
}

export default function ImageModal({ image, onClose, onUpdate, onDelete }: ImageModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(image.title || "");
  const [tags, setTags] = useState(image.tags.join(", "));
  const [isFavorite, setIsFavorite] = useState(image.isFavorite);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      const updatedImage = await updateImage(image.id, {
        title: title.trim() || undefined,
        tags: tags.trim() ? tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
        isFavorite
      });

      onUpdate(updatedImage);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update image");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      await deleteImage(image.id);
      onDelete(image.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete image");
      setShowDeleteConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <div className="flex items-center space-x-4">
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Image title..."
                className="text-xl font-semibold bg-neutral-800 text-white px-3 py-1 rounded border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-white"
              />
            ) : (
              <h2 className="text-xl font-semibold text-white">
                {image.title || image.originalName}
              </h2>
            )}

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-lg transition-colors ${
                isFavorite ? "text-yellow-400" : "text-neutral-400 hover:text-yellow-400"
              }`}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setTitle(image.title || "");
                    setTags(image.tags.join(", "));
                    setIsFavorite(image.isFavorite);
                  }}
                  className="px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors"
              >
                Edit
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-140px)]">
          {/* Image Display */}
          <div className="lg:flex-1 bg-neutral-800 flex items-center justify-center p-6">
            <img
              src={image.processedUrl}
              alt={image.title || image.originalName}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 p-6 space-y-6 overflow-y-auto">
            {error && (
              <div className="bg-red-600 text-white px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Image Info */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Image Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">File Size:</span>
                  <span className="text-white">{formatFileSize(image.fileSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Format:</span>
                  <span className="text-white">{image.fileType.split("/")[1].toUpperCase()}</span>
                </div>
                {image.dimensions && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Dimensions:</span>
                    <span className="text-white">{image.dimensions.width} × {image.dimensions.height}</span>
                  </div>
                )}
                {image.processingTime && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Processing Time:</span>
                    <span className="text-white">{(image.processingTime / 1000).toFixed(1)}s</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-400">Created:</span>
                  <span className="text-white">{formatDate(image.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Tags</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="nature, portrait, abstract..."
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {image.tags.length > 0 ? (
                    image.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-neutral-400 text-sm">No tags added</span>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleDownload(image.processedUrl, `${image.title || image.originalName}_processed.png`)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Download Processed
                </button>
                <button
                  onClick={() => handleDownload(image.originalUrl, image.originalName)}
                  className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors"
                >
                  Download Original
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Image
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-neutral-800 p-6 rounded-lg max-w-md">
              <h3 className="text-lg font-semibold text-white mb-4">Delete Image?</h3>
              <p className="text-neutral-300 mb-6">
                This action cannot be undone. The image will be permanently deleted from your gallery and storage.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
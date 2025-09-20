"use client";

import { useState, useEffect } from "react";
import { getImages, type GalleryResponse, type GalleryFilters } from "@/lib/api";
import ImageCard from "./ImageCard";
import GalleryFiltersComponent from "./GalleryFilters";
import ImageModal from "./ImageModal";
import { type UserImage } from "@/lib/api";

export default function ImageGallery() {
  const [galleryData, setGalleryData] = useState<GalleryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<GalleryFilters>({ page: 1, limit: 12 });
  const [selectedImage, setSelectedImage] = useState<UserImage | null>(null);

  const fetchImages = async (newFilters: GalleryFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getImages(newFilters);
      setGalleryData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(filters);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFiltersChange = (newFilters: GalleryFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    fetchImages(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    fetchImages(updatedFilters);
  };

  const handleImageUpdate = (updatedImage: UserImage) => {
    if (!galleryData) return;

    const updatedImages = galleryData.images.map(img =>
      img.id === updatedImage.id ? updatedImage : img
    );
    setGalleryData({ ...galleryData, images: updatedImages });
    setSelectedImage(updatedImage);
  };

  const handleImageDelete = (deletedImageId: string) => {
    if (!galleryData) return;

    const updatedImages = galleryData.images.filter(img => img.id !== deletedImageId);
    setGalleryData({
      ...galleryData,
      images: updatedImages,
      pagination: {
        ...galleryData.pagination,
        totalCount: galleryData.pagination.totalCount - 1
      }
    });
    setSelectedImage(null);

    // Refresh if current page is empty
    if (updatedImages.length === 0 && (filters.page || 1) > 1) {
      handlePageChange((filters.page || 1) - 1);
    }
  };

  if (loading && !galleryData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading your images...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold">Error Loading Gallery</h3>
          <p className="text-neutral-400 mt-2">{error}</p>
        </div>
        <button
          onClick={() => fetchImages(filters)}
          className="bg-white text-black px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GalleryFiltersComponent onFiltersChange={handleFiltersChange} />

      {galleryData?.images.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-neutral-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-white">No Images Found</h3>
            <p className="mt-2">
              {filters.search || filters.tags?.length || filters.favorites
                ? "Try adjusting your filters or upload some images to get started."
                : "Upload your first image to see it here."}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryData?.images.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>

          {/* Pagination */}
          {galleryData && galleryData.pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={() => handlePageChange((filters.page || 1) - 1)}
                disabled={!galleryData.pagination.hasPrev}
                className="px-4 py-2 bg-neutral-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-700 transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center space-x-2">
                {Array.from({ length: Math.min(5, galleryData.pagination.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  const isActive = pageNum === (filters.page || 1);
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded ${
                        isActive
                          ? "bg-white text-black"
                          : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                      } transition-colors`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange((filters.page || 1) + 1)}
                disabled={!galleryData.pagination.hasNext}
                className="px-4 py-2 bg-neutral-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-700 transition-colors"
              >
                Next
              </button>
            </div>
          )}

          {/* Results Info */}
          {galleryData && (
            <div className="text-center text-neutral-400 text-sm">
              Showing {galleryData.images.length} of {galleryData.pagination.totalCount} images
            </div>
          )}
        </>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onUpdate={handleImageUpdate}
          onDelete={handleImageDelete}
        />
      )}
    </div>
  );
}
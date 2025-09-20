"use client";

import { useState } from "react";
import { type GalleryFilters } from "@/lib/api";

interface GalleryFiltersProps {
  onFiltersChange: (filters: GalleryFilters) => void;
}

export default function GalleryFilters({ onFiltersChange }: GalleryFiltersProps) {
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState("");
  const [favorites, setFavorites] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({
      search: search.trim() || undefined,
      tags: tags.trim() ? tags.split(",").map(tag => tag.trim()).filter(Boolean) : undefined,
      favorites: favorites || undefined,
    });
  };

  const clearFilters = () => {
    setSearch("");
    setTags("");
    setFavorites(false);
    onFiltersChange({});
  };

  const hasActiveFilters = search.trim() || tags.trim() || favorites;

  return (
    <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search images by title or filename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors font-medium"
          >
            Search
          </button>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setFavorites(!favorites)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              favorites
                ? "bg-yellow-500 text-black border-yellow-500"
                : "bg-neutral-800 text-neutral-300 border-neutral-700 hover:border-neutral-600"
            }`}
          >
            <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Favorites Only
          </button>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-2 bg-neutral-800 text-neutral-300 border border-neutral-700 rounded-lg hover:border-neutral-600 transition-colors"
          >
            <svg className={`w-4 h-4 inline mr-2 transition-transform ${showAdvanced ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Advanced
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="border-t border-neutral-800 pt-4 mt-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="nature, portrait, abstract..."
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Enter tags separated by commas to filter images
                </p>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-neutral-800">
          <div className="text-sm text-neutral-400 mb-2">Active filters:</div>
          <div className="flex flex-wrap gap-2">
            {search.trim() && (
              <span className="bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full text-xs">
                Search: &quot;{search.trim()}&quot;
              </span>
            )}
            {tags.trim() && (
              <span className="bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full text-xs">
                Tags: {tags.trim()}
              </span>
            )}
            {favorites && (
              <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-xs">
                Favorites only
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
// Nouvelle architecture : utilisation des API routes Next.js
export interface ApiError {
  message: string;
  type: 'quota' | 'error' | 'warning';
  quotaInfo?: {
    usage: number;
    limit: number;
    remaining: number;
    resetTime: string;
    planType: string;
  };
}

export async function removeBackground(file: File): Promise<Blob> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/remove-background", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    // Gérer spécifiquement les erreurs de quota
    if (response.status === 429) {
      const quotaError: ApiError = {
        message: errorData.message || "Quota atteint. Vous avez épuisé votre limite quotidienne.",
        type: 'quota',
        quotaInfo: errorData.quotaInfo
      };

      // Message personnalisé selon le type de plan
      if (errorData.quotaInfo?.planType === 'anonymous') {
        quotaError.message = "Limite quotidienne atteinte. Connectez-vous pour obtenir plus d'utilisations ou revenez demain.";
      } else {
        quotaError.message = `Quota quotidien épuisé (${errorData.quotaInfo?.usage || 0}/${errorData.quotaInfo?.limit || 0}). Revenez demain à ${new Date(errorData.quotaInfo?.resetTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}.`;
      }

      throw quotaError;
    }

    // Autres erreurs
    const apiError: ApiError = {
      message: errorData.message || `Erreur API: ${response.status}`,
      type: 'error'
    };
    throw apiError;
  }

  return response.blob();
}

export interface QuotaInfo {
  usage: number;
  limit: number;
  remaining: number;
  canUse: boolean;
  percentage: number;
  status: 'safe' | 'warning' | 'critical';
  message: string;
  isAuthenticated: boolean;
  userInfo?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  quotaType: 'premium' | 'free';
  resetTime: string;
}

export async function getQuotas(): Promise<QuotaInfo> {
  const response = await fetch("/api/quotas", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Erreur quotas: ${response.status}`);
  }

  return response.json();
}

// Fonction helper pour vérifier si l'utilisateur peut uploader
export async function canUserUpload(): Promise<{ canUpload: boolean; quotaInfo: QuotaInfo }> {
  const quotaInfo = await getQuotas();
  return {
    canUpload: quotaInfo.canUse,
    quotaInfo
  };
}

// Gallery API Types
export interface UserImage {
  id: string;
  userId: string;
  title: string | null;
  originalUrl: string;
  processedUrl: string;
  thumbnailUrl: string | null;
  originalName: string;
  fileSize: number;
  fileType: string;
  dimensions: { width: number; height: number } | null;
  processingTime: number | null;
  quality: string | null;
  tags: string[];
  isPublic: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string | null;
    email: string | null;
  };
}

export interface GalleryResponse {
  images: UserImage[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface GalleryFilters {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[];
  favorites?: boolean;
}

// Gallery API Functions
export async function getImages(filters: GalleryFilters = {}): Promise<GalleryResponse> {
  const params = new URLSearchParams();

  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.tags && filters.tags.length > 0) params.append('tags', filters.tags.join(','));
  if (filters.favorites) params.append('favorites', 'true');

  const response = await fetch(`/api/images?${params.toString()}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch images: ${response.status}`);
  }

  return response.json();
}

export async function getImage(id: string): Promise<UserImage> {
  const response = await fetch(`/api/images/${id}`, {
    method: 'GET',
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Image not found');
    }
    throw new Error(`Failed to fetch image: ${response.status}`);
  }

  return response.json();
}

export async function updateImage(
  id: string,
  updates: { title?: string; tags?: string[]; isFavorite?: boolean }
): Promise<UserImage> {
  const response = await fetch(`/api/images/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to update image: ${response.status}`);
  }

  return response.json();
}

export async function deleteImage(id: string): Promise<void> {
  const response = await fetch(`/api/images/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to delete image: ${response.status}`);
  }
}

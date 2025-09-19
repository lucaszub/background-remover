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

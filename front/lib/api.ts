// Nouvelle architecture : utilisation des API routes Next.js
export async function removeBackground(file: File): Promise<Blob> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/remove-background", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erreur API: ${response.status}`);
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

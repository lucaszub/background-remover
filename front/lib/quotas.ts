import { Session } from 'next-auth'

export interface QuotaData {
  usage: number
  date: string
  lastReset: Date
}

// Stockage en mémoire pour le développement
const quotaStore = new Map<string, QuotaData>()

export function getQuotaKey(session: Session | null, ip: string): string {
  if (session?.user?.email) {
    return `user:${session.user.email}`
  }
  return `ip:${ip}`
}

export function getQuotaLimit(session: Session | null): number {
  return session ? 20 : 5
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

export function shouldReset(lastReset: Date): boolean {
  const today = getTodayString()
  const lastResetDate = lastReset.toISOString().split('T')[0]
  return lastResetDate !== today
}

export async function checkQuota(key: string): Promise<{ usage: number; limit: number; canUse: boolean }> {
  const isAuth = key.startsWith('user:')
  const limit = isAuth ? 20 : 5
  
  let quotaData = quotaStore.get(key)
  
  // Initialiser si pas de données
  if (!quotaData) {
    quotaData = {
      usage: 0,
      date: getTodayString(),
      lastReset: new Date()
    }
    quotaStore.set(key, quotaData)
  }
  
  // Reset si nécessaire
  if (shouldReset(quotaData.lastReset)) {
    quotaData.usage = 0
    quotaData.date = getTodayString()
    quotaData.lastReset = new Date()
    quotaStore.set(key, quotaData)
  }
  
  return {
    usage: quotaData.usage,
    limit,
    canUse: quotaData.usage < limit
  }
}

export async function incrementQuota(key: string): Promise<void> {
  const quotaData = quotaStore.get(key)
  if (quotaData) {
    quotaData.usage++
    quotaStore.set(key, quotaData)
  }
}

export function getQuotaMessage(usage: number, limit: number, isAuth: boolean): string {
  const remaining = limit - usage
  
  if (remaining <= 0) {
    return isAuth 
      ? "Quota journalier atteint! Revenez demain à minuit."
      : "Images gratuites épuisées! Connectez-vous pour 20 images/jour.";
  }
  
  if (remaining <= 2) {
    return isAuth
      ? `Plus que ${remaining} images aujourd'hui!`
      : `Plus que ${remaining} images gratuites. Connectez-vous pour plus!`;
  }
  
  return `${remaining} images restantes aujourd'hui`;
}
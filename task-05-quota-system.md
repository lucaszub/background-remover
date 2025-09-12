# TÂCHE 5: Système de Quotas Avancé

## Objectif

Implémenter un système de quotas robuste avec distinction utilisateurs connectés/non-connectés et reset automatique.

## Architecture Quotas

### Stratégie de stockage

- **Développement**: Map() en mémoire dans Next.js
- **Production**: Upstash Redis (recommandé pour persistance)

### Structure des données

```typescript
interface QuotaData {
  usage: number;           // Images traitées aujourd'hui
  date: string;           // Date format YYYY-MM-DD
  lastReset: Date;        // Timestamp dernier reset
}

// Clés de stockage
Map<string, QuotaData> = {
  "ip:192.168.1.1": { usage: 3, date: "2024-12-01", lastReset: ... },
  "user:john@gmail.com": { usage: 15, date: "2024-12-01", lastReset: ... }
}
```

### Règles de quotas

- **Non-connecté** (IP): 5 images/jour
- **Connecté** (email): 20 images/jour
- **Reset**: Automatique à minuit (timezone locale)

## Fonctions utilitaires à créer

### `lib/quotas.ts`

```typescript
export function getQuotaKey(session: Session | null, ip: string): string;
export function getQuotaLimit(session: Session | null): number;
export function checkQuota(
  key: string
): Promise<{ usage: number; limit: number; canUse: boolean }>;
export function incrementQuota(key: string): Promise<void>;
export function resetExpiredQuotas(): Promise<void>;
export function getQuotaMessage(
  usage: number,
  limit: number,
  isAuth: boolean
): string;
```

## Reset automatique

### Stratégie

1. **Vérification lors de chaque appel**: Si `lastReset < aujourd'hui` -> reset usage
2. **Cron job optionnel**: Script de nettoyage nocturne
3. **TTL Redis**: Expiration automatique 24h (si Redis)

### Code reset

```typescript
function shouldReset(lastReset: Date): boolean {
  const today = new Date().toDateString();
  return lastReset.toDateString() !== today;
}
```

## Migration vers Redis (Production)

### Configuration Upstash

```bash
# .env.local
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

### Code conditionnel

```typescript
const useRedis = process.env.NODE_ENV === "production";
const quotaStore = useRedis ? new RedisQuotaStore() : new MemoryQuotaStore();
```

## Messages utilisateur

### Templates

- Non-connecté dépassé: `"Vous avez utilisé vos 5 images gratuites. Connectez-vous pour 15 images supplémentaires!"`
- Connecté dépassé: `"Quota journalier atteint (20/20). Revenez demain ou souscrivez à un plan Premium."`
- Proche limite: `"Il vous reste 2 images aujourd'hui. Connectez-vous pour plus!"`

## Monitoring & Analytics

### Métriques à tracker

- Usage quotas par type (auth/non-auth)
- Pics d'utilisation par heure
- Taux de conversion non-auth -> auth
- Images traitées avec succès vs échecs

## Test de validation

- Utilisateur non-connecté: 5 images max
- Utilisateur connecté: 20 images max
- Reset automatique à minuit fonctionne
- Messages appropriés selon situation
- Performance acceptable (<100ms check quota)

## ✅ STATUT: Effectué

- [x] Fonctions utilitaires quotas créées
- [x] Système reset automatique implémenté
- [x] Messages utilisateur contextuel
- [ ] Tests unitaires quotas
- [ ] Migration optionnelle vers Redis

# TÂCHE 7: Interface Utilisateur Quotas

## Objectif

Créer une interface utilisateur intuitive qui affiche les quotas et encourage la connexion Google selon le statut.

## Composants à créer/modifier

### `components/QuotaDisplay.tsx`
```typescript
interface QuotaDisplayProps {
  usage: number;
  limit: number;
  isAuthenticated: boolean;
}

// Affichage:
// Non-connecté: "3/5 images utilisées aujourd'hui"  
// Connecté: "12/20 images utilisées aujourd'hui"
// + Barre de progression visuelle
```

### `components/ImageUpload.tsx` - Version conditionnelle
```typescript
// Logique d'affichage:
// 1. Si quota atteint ET non-connecté -> Bouton "Se connecter pour plus d'images"
// 2. Si quota atteint ET connecté -> Message "Revenez demain"
// 3. Si quota OK -> Interface upload normale
// 4. Hook pour récupérer quotas actuels
```

## Hook personnalisé

### `hooks/useQuotas.ts`
```typescript
export function useQuotas() {
  const { data: session } = useSession();
  
  return {
    usage: number,
    limit: number, 
    remaining: number,
    canUpload: boolean,
    isLoading: boolean,
    refresh: () => void,
    quotaMessage: string
  }
}
```

## États d'interface

### 1. Non-connecté avec quota disponible
```tsx
<div className="quota-info">
  <QuotaDisplay usage={2} limit={5} isAuthenticated={false} />
  <p className="text-sm text-neutral-400">
    Il vous reste 3 images gratuites. 
    <button onClick={() => signIn('google')} className="text-blue-400">
      Connectez-vous pour 15 images supplémentaires!
    </button>
  </p>
</div>
```

### 2. Non-connecté avec quota épuisé
```tsx
<div className="quota-exhausted">
  <QuotaDisplay usage={5} limit={5} isAuthenticated={false} />
  <div className="upgrade-prompt">
    <h3>Quota journalier atteint!</h3>
    <p>Connectez-vous avec Google pour 20 images/jour</p>
    <button onClick={() => signIn('google')} className="btn-primary">
      Se connecter avec Google
    </button>
  </div>
</div>
```

### 3. Connecté avec quota disponible  
```tsx
<div className="quota-info">
  <QuotaDisplay usage={12} limit={20} isAuthenticated={true} />
  <p className="text-sm text-green-400">
    ✓ Compte Premium: {20-12} images restantes aujourd'hui
  </p>
</div>
```

### 4. Connecté avec quota épuisé
```tsx
<div className="quota-exhausted">
  <QuotaDisplay usage={20} limit={20} isAuthenticated={true} />
  <div className="premium-upsell">
    <h3>Quota Premium atteint!</h3>
    <p>Revenez demain à minuit pour 20 nouvelles images</p>
    <small>Ou souscrivez au plan Pro pour plus d'images</small>
  </div>
</div>
```

## Design visuel

### Barre de progression
```tsx
<div className="progress-bar">
  <div 
    className="progress-fill"
    style={{ width: `${(usage/limit)*100}%` }}
  />
  <span className="progress-text">{usage}/{limit}</span>
</div>
```

### Couleurs selon statut
- **Vert**: < 50% du quota utilisé
- **Orange**: 50-80% du quota utilisé  
- **Rouge**: > 80% ou quota atteint
- **Bleu**: Incitation à se connecter

## Messages contextuels

### Templates dynamiques
```typescript
function getQuotaMessage(usage: number, limit: number, isAuth: boolean): string {
  const remaining = limit - usage;
  
  if (remaining <= 0) {
    return isAuth 
      ? "Quota journalier atteint! Revenez demain à minuit."
      : "Images gratuites épuisées! Connectez-vous pour 15 images supplémentaires.";
  }
  
  if (remaining <= 2) {
    return isAuth
      ? `Plus que ${remaining} images aujourd'hui!`
      : `Plus que ${remaining} images gratuites. Connectez-vous pour plus!`;
  }
  
  return `${remaining} images restantes aujourd'hui`;
}
```

## Intégration avec upload

### Workflow complet
1. **Page load**: Récupérer quotas via `useQuotas()`
2. **Avant upload**: Vérifier `canUpload`
3. **Après upload**: Rafraîchir quotas automatiquement
4. **Gestion erreurs**: Si 429 -> afficher message quota + CTA connexion

### Gestion d'erreurs
```typescript
// Dans ImageUpload component
try {
  const result = await uploadImage(file);
  refreshQuotas(); // Mise à jour compteur
} catch (error) {
  if (error.status === 429) {
    // Afficher interface "quota atteint" 
    setShowQuotaError(true);
  }
}
```

## Animations et UX

- **Compteur animé**: Progression fluide après upload
- **Loading states**: Skeleton pendant récupération quotas
- **Success feedback**: "Image traitée! Plus que X images aujourd'hui"
- **Micro-interactions**: Hover effects sur boutons CTA

## Test de validation

- Affichage correct quota non-connecté vs connecté
- Messages encourageant connexion quand pertinent  
- Compteurs mis à jour après chaque upload
- Boutons CTA fonctionnels (signIn Google)
- Design responsive mobile/desktop
- États de chargement fluides

## ❌ STATUT: À FAIRE
- Composant QuotaDisplay à créer
- Hook useQuotas à implémenter
- Interface conditionnelle selon quotas
- Messages contextuels et CTA
- Integration avec ImageUpload existant
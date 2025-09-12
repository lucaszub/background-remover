# TÂCHE 4: API Routes Next.js

## Objectif

Créer les routes API Next.js pour gérer l'authentification et les quotas côté frontend, puis appeler FastAPI pour le traitement ML.

## Fichiers à créer

### `/app/api/remove-background/route.ts`

Route principale qui gère:

- Vérification session utilisateur (connecté/non-connecté)
- Gestion quotas (5 pour non-auth, 20 pour auth)
- Appel FastAPI avec API key
- Incrémentation quotas après succès

### `/app/api/quotas/route.ts`

Route pour consulter les quotas actuels:

- GET: retourne usage actuel selon IP/email
- Distinction connecté/non-connecté

## Configuration requise

### Variables environnement (.env.local)

```bash
FASTAPI_URL=http://localhost:8000
FASTAPI_SECRET_KEY=your-secret-api-key-here
```

### Système de quotas

- **Clé non-connecté**: IP address (`req.ip`)
- **Clé connecté**: email utilisateur (`session.user.email`)
- **Stockage**: Map() en mémoire (ou Upstash Redis)
- **Reset**: automatique à minuit (timezone locale)

## Logique API route /remove-background

```typescript
1. Récupérer session NextAuth
2. Déterminer clé quota: session?.user?.email || req.ip
3. Déterminer limite: session ? 20 : 5
4. Vérifier quota actuel < limite
5. Si quota atteint -> 429 avec message approprié
6. Appeler FastAPI avec headers { x-api-key: FASTAPI_SECRET_KEY }
7. Si succès FastAPI -> incrémenter quota
8. Retourner résultat à frontend
```

## Messages d'erreur

- Non-connecté: `"Quota journalier atteint (5/5). Connectez-vous pour 20 images/jour."`
- Connecté: `"Quota journalier atteint (20/20). Revenez demain!"`

## Test de validation

- Appel sans session -> quotas 5
- Appel avec session -> quotas 20
- Quota atteint -> erreur 429 appropriée
- Reset automatique minuit fonctionne

## ✅ STATUT: COMPLÉTÉE

- ✅ Route `/api/remove-background` créée avec gestion quotas
- ✅ Route `/api/quotas` créée pour consulter l'usage
- ✅ Système quotas IP/email implémenté (Map mémoire)
- ✅ Variables environnement FASTAPI_URL + FASTAPI_SECRET_KEY
- ✅ FastAPI modifié : route `/process-image` avec API key
- ✅ Intégration complète Next.js ↔ FastAPI
- ✅ Fonction `lib/api.ts` mise à jour pour nouvelles routes

### Fonctionnalités implémentées:

- Quotas: 5 (non-connecté IP) / 20 (connecté email)
- Reset automatique quotas à minuit
- Messages contextuels selon statut auth
- Validation fichiers (type, taille max 10MB)
- Headers quota dans responses
- Gestion erreurs robuste

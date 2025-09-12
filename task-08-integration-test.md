# TÂCHE 8: Tests d'Intégration Complète

## Objectif

Valider le flow complet de l'architecture simplifiée: Next.js Full-Stack + FastAPI ML avec système de quotas.

## Scenarios de test

### 1. Utilisateur non-connecté (IP-based quotas)

#### Test 1.1: Premier upload
- ✅ Page charge -> quota affiché "0/5 utilisées"
- ✅ Upload image -> traitement réussi  
- ✅ Quota mis à jour -> "1/5 utilisées"
- ✅ Message: "Il vous reste 4 images. Connectez-vous pour plus!"

#### Test 1.2: Approche limite
- ✅ 4ème upload -> "4/5 utilisées"
- ✅ Message: "Plus qu'1 image gratuite! Connectez-vous pour 15 supplémentaires"
- ✅ Bouton CTA Google visible et fonctionnel

#### Test 1.3: Quota épuisé
- ✅ 5ème upload -> "5/5 utilisées"  
- ✅ 6ème tentative -> Erreur 429
- ✅ Interface bloquée avec CTA connexion
- ✅ Message: "Images gratuites épuisées! Connectez-vous pour 20 images/jour"

### 2. Utilisateur connecté (Email-based quotas)

#### Test 2.1: Connexion Google
- ✅ Click "Se connecter" -> Redirect Google OAuth
- ✅ Callback réussi -> Session active
- ✅ Quota reset -> "0/20 utilisées" (nouveau compteur)
- ✅ Profil affiché dans header

#### Test 2.2: Quota premium  
- ✅ Upload 15 images -> "15/20 utilisées"
- ✅ Message: "✓ Compte Premium: 5 images restantes"
- ✅ Pas de CTA connexion (déjà connecté)

#### Test 2.3: Quota premium épuisé
- ✅ 20ème upload -> "20/20 utilisées"
- ✅ 21ème tentative -> Erreur 429  
- ✅ Message: "Quota Premium atteint! Revenez demain à minuit"

### 3. Reset automatique quotas

#### Test 3.1: Simulation minuit
- ✅ Forcer date suivante (dev tools)
- ✅ Prochain appel quota -> Reset automatique
- ✅ Non-connecté: "0/5" | Connecté: "0/20"

#### Test 3.2: Persistance session
- ✅ Refresh page après reset -> Session maintenue
- ✅ Quotas correctement réinitialisés
- ✅ IP vs email cohérent

### 4. Communication Next.js ↔ FastAPI

#### Test 4.1: Protection API key
- ✅ Next.js appelle FastAPI avec header `x-api-key`
- ✅ FastAPI rejette sans API key -> 401
- ✅ FastAPI accepte avec bonne API key -> Traitement

#### Test 4.2: Gestion erreurs ML
- ✅ Image corrompue -> FastAPI 500 -> Next.js gère erreur
- ✅ Format non supporté -> Message d'erreur approprié
- ✅ Quota non incrémenté si échec traitement

### 5. Tests de charge et limites

#### Test 5.1: Concurrent uploads
- ✅ 2 uploads simultanés même user -> Quotas cohérents
- ✅ Race conditions gérées correctement
- ✅ Pas de double comptage

#### Test 5.2: IPs multiples  
- ✅ 2 IPs différentes -> Quotas séparés (5 chacune)
- ✅ Même email, IPs différentes -> Quota unifié (20 total)

## Environnements de test

### Développement local
```bash
# Terminal 1: FastAPI
cd backend && uvicorn main:app --reload --port 8000

# Terminal 2: Next.js  
cd front && npm run dev

# Test URLs
# Frontend: http://localhost:3000
# FastAPI: http://localhost:8000/docs
```

### Variables test
```bash
# .env.local (Next.js)
FASTAPI_URL=http://localhost:8000
FASTAPI_SECRET_KEY=test-key-12345
GOOGLE_CLIENT_ID=[existing]
GOOGLE_CLIENT_SECRET=[existing]

# .env (FastAPI)
FASTAPI_SECRET_KEY=test-key-12345
```

## Outils de validation

### 1. DevTools Network
- Vérifier headers API key dans requests
- Confirmer responses 200/429/401
- Temps de réponse < 5s pour traitement

### 2. Console logs
```typescript
// Debug quotas côté Next.js
console.log('Quota check:', { key, usage, limit, canUse });
console.log('FastAPI call:', { url, headers, status });
```

### 3. FastAPI logs
```python
# Debug côté ML
import logging
logging.info(f"Processing image for API key: {x_api_key[:10]}...")
```

## Métriques de performance

- **Quota check**: < 100ms
- **Upload + processing**: < 5s (selon taille image)
- **UI updates**: < 200ms (quota display)
- **Memory usage**: Stable (pas de leaks quotas)

## Rollback plan

Si tests échouent:
1. **Garder ancien système** FastAPI auth en parallèle  
2. **Feature flag** pour basculer architecture
3. **Monitoring** erreurs 429 vs succès rate
4. **Gradual rollout** 10% traffic nouvelle archi

## Documentation résultats

### Checklist finale
- [ ] Tous les scenarios passent ✅
- [ ] Performance acceptable ✅  
- [ ] Gestion erreurs robuste ✅
- [ ] UX quotas intuitive ✅
- [ ] Sécurité API key OK ✅
- [ ] Reset minuit fonctionnel ✅

### Rapport de test
```markdown
## Test Results - Architecture Simplifiée

**Date**: [DATE]
**Environment**: Development local
**Duration**: X minutes

### ✅ Passed (X/Y)
- User non-connecté quotas: PASS
- User connecté quotas: PASS  
- Reset automatique: PASS
- Communication Next.js/FastAPI: PASS

### ❌ Failed (0/Y)
- None

### Performance
- Average upload time: Xs
- Quota check time: Xms
- Memory usage: XMB stable

### Recommendations
- Deploy to staging for production test
- Monitor quota usage patterns
- Consider Redis for production
```

## ❌ STATUT: À FAIRE
- Scenarios de test à exécuter
- Validation flow complet non-connecté  
- Validation flow complet connecté
- Tests performance et limites
- Documentation résultats
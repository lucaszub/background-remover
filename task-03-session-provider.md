---

### **4. Tâche 3 - Session Provider**

**Nom fichier**: `task-03-session-provider.md`

```markdown
# TÂCHE 3: Wrapper Application avec SessionProvider

## Objectif

Rendre les sessions NextAuth disponibles dans toute l'app.

## Fichier à modifier

`pages/_app.js` (ou `app/layout.js` si App Router)

## Actions

1. Importer SessionProvider from 'next-auth/react'
2. Wrapper le Component principal avec SessionProvider
3. Passer session depuis pageProps

## Configuration

- Pas d'options spéciales requises pour le SessionProvider
- Juste wrapper basique

## Test de validation

- Hook useSession() doit fonctionner dans n'importe quel composant
- Session persiste après refresh de page
- signIn() et signOut() fonctionnels

## ✅ STATUT: COMPLÉTÉE
- `AuthProvider.tsx` créé avec SessionProvider
- `app/layout.tsx` modifié pour wrapper l'application
- Sessions NextAuth disponibles dans toute l'app
- Hooks useSession, signIn, signOut fonctionnels

### 🔄 Nouvelle architecture MVP
SessionProvider critique pour:
- Déterminer status auth dans API routes Next.js
- Clé quota: session?.user?.email || req.ip
- Limites: session ? 20 : 5
- Plus de communication directe avec FastAPI côté client
```

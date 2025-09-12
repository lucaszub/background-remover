# TÂCHE 2: Configuration NextAuth.js

## Objectif

Créer la configuration NextAuth avec Google Provider uniquement.

## Packages à installer

```bash
npm install next-auth
```

## Fichier à créer

pages/api/auth/[...nextauth].js

## Configuration required

- GoogleProvider uniquement (pas d'autres providers)
- Callbacks JWT pour récupérer token Google
- Session strategy: JWT (pas de base de données)
- Pages custom pour signin si besoin

## Variables environnement

Créer .env.local:

```bash
GOOGLE_CLIENT_ID=ton_client_id_ici
GOOGLE_CLIENT_SECRET=ton_secret_ici
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=genere_string_aleatoire_32_chars
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Test de validation

- Naviguer vers http://localhost:3000/api/auth/signin
- Bouton Google doit apparaître
- Click redirect vers Google OAuth
- Callback ramène vers l'app

## ✅ STATUT: COMPLÉTÉE
- Package next-auth installé
- Route API `/api/auth/[...nextauth]/route.ts` créée
- Configuration Google Provider avec callbacks JWT
- Variables d'environnement dans `.env.local`
- Pages signin/error créées

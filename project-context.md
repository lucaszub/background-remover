# Background Remover - Contexte Projet

## Stack Technique

- Backend: FastAPI (Python)
- Frontend: Next.js 14 (React)
- Auth: NextAuth.js + Google OAuth uniquement
- Deploy: Azure Container Apps (API) + Vercel/custom (frontend)

## URLs

### Développement

- Frontend: http://localhost:3000
- Backend: http://localhost:8000

### Production

- Frontend: https://background-remover.lucaszubiarrain.com
- Backend: https://background-remover-api.blackpond-57f13826.westeurope.azurecontainerapps.io

## Feature Principale

API qui supprime le fond des images, protégée par authentification Google.

## État Actuel

- ✅ Backend FastAPI avec endpoint /remove-background fonctionnel
- ✅ Frontend Next.js avec interface upload basique
- ❌ Pas d'authentification (à implémenter)

## Objectif MVP

Ajouter Google OAuth pour protéger l'API. User doit être connecté pour traiter des images.

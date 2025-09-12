# TÂCHE 7: Hook pour Appels API Authentifiés

## Objectif

Créer hook React qui ajoute automatiquement token aux appels API.

## Fichier à créer

`hooks/useAuthenticatedAPI.js`

## Fonctionnalité required

- Hook qui utilise useSession() NextAuth
- Fonction apiCall(url, options) qui ajoute Authorization header
- Support FormData pour upload d'images
- Gestion erreurs 401 -> redirect vers login

## Comportement expected

- Récupère token depuis session NextAuth
- Ajoute "Authorization: Bearer {token}" aux headers
- Si erreur 401: appeler signIn() pour redirect login

## Test de validation

- Appels API incluent bien le header Authorization
- Erreur 401 déclenche redirect login automatique

## ❌ STATUT: NON FAITE
- Hook `useAuthenticatedAPI` à créer dans hooks/
- Récupération automatique du token depuis session NextAuth
- Ajout header Authorization aux appels API
- Gestion erreurs 401 avec redirect login

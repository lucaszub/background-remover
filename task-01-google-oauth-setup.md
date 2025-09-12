# TÂCHE 1: Configuration Google OAuth Console

## Objectif

Configurer Google Cloud Console pour permettre OAuth sur notre app.

## Actions à faire

1. Aller sur https://console.cloud.google.com
2. Créer/sélectionner projet "background-remover"
3. Aller dans "APIs & Services" > "Credentials"
4. Cliquer "Create Credentials" > "OAuth 2.0 Client ID"
5. Choisir "Web application"

## Configuration Required

### Authorized JavaScript origins

http://localhost:3000
https://background-remover.lucaszubiarrain.com

### Authorized redirect URIs

http://localhost:3000/api/auth/callback/google
https://background-remover.lucaszubiarrain.com/api/auth/callback/google

## Output

Tu récupères:

- GOOGLE_CLIENT_ID (commence par xxx.apps.googleusercontent.com)
- GOOGLE_CLIENT_SECRET

## Test de validation

Les URLs de callback doivent être accessibles et les domaines autorisés.

id_client=[CONFIGURÉ]
code_secret=[CONFIGURÉ]

## ✅ STATUT: COMPLÉTÉE
- Configuration Google Cloud Console terminée
- Client ID et Secret récupérés
- URLs de callback configurées

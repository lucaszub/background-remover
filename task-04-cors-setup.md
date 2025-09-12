# TÂCHE 4: Configuration CORS FastAPI

## Objectif

Permettre appels cross-domain depuis Next.js vers FastAPI.

## Package à installer

```bash
pip install fastapi[all] python-multipart
```

## Fichier à modifier

main.py (ton fichier principal FastAPI)

```python
origins = [
    "http://localhost:3000",      # Next.js dev
    "http://127.0.0.1:3000",      # Alternative localhost
    "https://background-remover.lucaszubiarrain.com",  # Production
]

# Paramètres obligatoires:
allow_credentials=True
allow_methods=["GET", "POST", "OPTIONS"]
allow_headers=["Authorization", "Content-Type"]
```

## Test de validation

- Aucune erreur CORS dans console navigateur
- Preflight OPTIONS request passe
- POST requests avec Authorization header acceptés

## ❌ STATUT: NON FAITE
- Modification côté backend FastAPI requise
- Configuration CORS à ajouter dans main.py
- Paramètres origins, credentials, methods, headers à définir

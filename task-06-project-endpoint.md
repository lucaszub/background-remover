# TÂCHE 6: Protéger Route Remove Background

## Objectif

Ajouter authentification required à l'endpoint /remove-background.

## Fichier à modifier

`main.py` (route /remove-background existante)

## Modification required

- Ajouter dependency: `current_user = Depends(get_current_user)`
- Garder logique actuelle de traitement d'image
- Optionnel: logger quel user fait la requête

## Comportement expected

- Sans token: retour HTTP 401
- Avec token valide: traitement normal de l'image
- Token expiré: retour HTTP 401

## Test de validation

- curl sans Authorization header -> 401
- curl avec token valide -> image traitée
- curl avec token invalide -> 401

## ❌ STATUT: NON FAITE
- Route `/remove-background` à protéger dans main.py
- Dependency `get_current_user` à ajouter
- Authentification requise pour traitement d'images
- Dépend de la completion de Task-05 (Auth Middleware)

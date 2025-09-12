---

### **6. Tâche 5 - Auth Middleware**

**Nom fichier**: `task-05-auth-middleware.md`

```markdown
# TÂCHE 5: Middleware Authentication FastAPI

## Objectif

Créer système de vérification des tokens Google côté API.

## Fichier à créer

`auth.py`

## Fonctions required

1. `verify_google_token(token: str)` -> user info ou exception
2. `get_current_user()` -> FastAPI Dependency
3. Gestion erreurs HTTP 401

## API Google à utiliser
```

GET https://www.googleapis.com/oauth2/v2/userinfo
Header: Authorization: Bearer {google_token}

## Comportement expected

- Token valide -> return user data (email, name, picture)
- Token invalide/expiré -> HTTPException 401
- Pas de token -> HTTPException 401

## Test de validation

Tester avec token valide/invalide/absent via Postman ou curl.

## ❌ STATUT: NON FAITE
- Fichier `auth.py` à créer côté backend
- Fonction `verify_google_token()` à implémenter
- Dependency `get_current_user()` pour FastAPI à créer
- Vérification tokens Google via API googleapis

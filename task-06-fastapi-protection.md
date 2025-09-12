# TÂCHE 6: Protection Simple FastAPI

## Objectif

Simplifier drastiquement FastAPI pour qu'il ne gère QUE le traitement ML avec une protection API key basique.

## Architecture simplifiée

FastAPI devient un **microservice ML pur**:
- 1 seule route: `/process-image`
- 1 seule protection: API key dans header
- Aucune auth utilisateur complexe
- Aucune gestion de sessions/quotas

## Fichier à modifier

### `main.py` - Version simplifiée
```python
from fastapi import FastAPI, File, UploadFile, Header, HTTPException
import uvicorn

app = FastAPI(title="Background Remover ML API")

# Protection simple par API key
def verify_api_key(x_api_key: str = Header()):
    if x_api_key != "your-secret-api-key-here":  # À mettre en env var
        raise HTTPException(status_code=401, detail="Invalid API key")
    return True

@app.post("/process-image")
async def process_image(
    file: UploadFile = File(...),
    api_key_valid: bool = Depends(verify_api_key)
):
    """
    Route unique: traite image et retourne résultat
    Authentification: API key seulement
    """
    try:
        # Logique ML existante (rembg, etc.)
        processed_image = remove_background(file)
        return processed_image
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Pas de routes auth, pas de CORS complexe, pas de middleware user
```

## Variables environnement

### `.env` (FastAPI)
```bash
# Une seule variable nécessaire
FASTAPI_SECRET_KEY=your-secret-api-key-here
```

### Protection en production
```python
import os
from fastapi import Security
from fastapi.security import HTTPBearer

API_SECRET_KEY = os.getenv("FASTAPI_SECRET_KEY")
if not API_SECRET_KEY:
    raise ValueError("FASTAPI_SECRET_KEY must be set")

def verify_api_key(x_api_key: str = Header()):
    if x_api_key != API_SECRET_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return True
```

## Suppression du code complexe

### À supprimer
- ❌ Toutes les routes `/auth/*`
- ❌ Middleware OAuth/JWT
- ❌ Vérification tokens Google  
- ❌ Gestion sessions/users
- ❌ CORS complexe avec credentials
- ❌ Dependencies `get_current_user`

### À garder
- ✅ Route `/process-image` uniquement
- ✅ Logique ML (rembg, PIL, etc.)
- ✅ Gestion erreurs processing
- ✅ Upload/download fichiers
- ✅ Protection API key simple

## CORS minimal

```python
from fastapi.middleware.cors import CORSMiddleware

# CORS simple pour Next.js seulement
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://votre-domaine.com"],
    allow_methods=["POST"],  # Seulement POST pour /process-image
    allow_headers=["Content-Type", "x-api-key"],  # Header API key
    allow_credentials=False  # Pas de cookies/auth complexe
)
```

## Appels depuis Next.js

```typescript
// Dans /api/remove-background/route.ts
const response = await fetch(`${FASTAPI_URL}/process-image`, {
  method: 'POST',
  headers: {
    'x-api-key': process.env.FASTAPI_SECRET_KEY!
  },
  body: formData // File upload
});
```

## Test de validation

- POST `/process-image` sans header -> 401
- POST `/process-image` avec mauvaise API key -> 401  
- POST `/process-image` avec bonne API key -> image traitée
- Aucune autre route accessible
- Performance ML inchangée

## Avantages architecture

- 🚀 **Simplicité**: FastAPI focus 100% ML
- 🔒 **Sécurité**: API key côté Next.js (non exposée)
- ⚡ **Performance**: Pas de vérifications auth complexes  
- 🧹 **Maintenance**: Code FastAPI minimal et clair
- 📊 **Monitoring**: Logs simples des traitements ML

## ❌ STATUT: À FAIRE
- Simplifier main.py pour API key seulement
- Supprimer tout le code auth FastAPI existant
- Tester appels depuis Next.js avec header
- Variables environnement côté FastAPI
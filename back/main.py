import os
from fastapi import FastAPI, File, UploadFile, Header, HTTPException, Depends
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove

app = FastAPI(title="Background Remover ML API", version="2.0")

# Configuration simplifiée CORS pour Next.js seulement
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "https://background-remover.lucaszubiarrain.com"
    ],
    allow_credentials=False,  # Pas de cookies/auth complexe
    allow_methods=["POST"],   # Seulement POST pour /process-image
    allow_headers=["Content-Type", "x-api-key"],  # Header API key
)

# Protection simple par API key
FASTAPI_SECRET_KEY = os.getenv("FASTAPI_SECRET_KEY", "bg-remover-secret-2024")

def verify_api_key(x_api_key: str = Header()):
    """Vérification simple de l'API key"""
    if x_api_key != FASTAPI_SECRET_KEY:
        raise HTTPException(
            status_code=401, 
            detail="Invalid API key"
        )
    return True

@app.get("/")
async def read_root():
    return {
        "message": "Background Remover ML API", 
        "version": "2.0",
        "status": "active"
    }

@app.post("/process-image")
async def process_image(
    file: UploadFile = File(...),
    _: bool = Depends(verify_api_key)
):
    """
    Route unique: traite image et retourne résultat
    Authentification: API key seulement
    """
    try:
        # Valider le type de fichier
        allowed_types = ["image/jpeg", "image/png", "image/webp"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Please upload JPEG, PNG, or WebP images."
            )
        
        # Lire et traiter l'image
        image_bytes = await file.read()
        
        if len(image_bytes) == 0:
            raise HTTPException(
                status_code=400,
                detail="Empty file uploaded"
            )
        
        # Traitement ML avec rembg
        output = remove(image_bytes)
        
        return Response(
            content=output, 
            media_type="image/png",
            headers={
                "Content-Disposition": "attachment; filename=background-removed.png"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Image processing failed: {str(e)}"
        )

# Supprimer l'ancienne route pour éviter confusion
# @app.post("/remove-bg") - DEPRECATED

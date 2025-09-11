from fastapi import FastAPI, File, UploadFile
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove

app = FastAPI()

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, remplacez par votre domaine frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
	return {"Hello": "World"}

@app.post("/remove-bg")
async def remove_bg(file: UploadFile = File(...)):
	image_bytes = await file.read()
	output = remove(image_bytes)
	return Response(content=output, media_type="image/png")

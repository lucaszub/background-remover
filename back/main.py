from fastapi import FastAPI, File, UploadFile
from fastapi.responses import Response
from rembg import remove

app = FastAPI()

@app.get("/")
async def read_root():
	return {"Hello": "World"}

@app.post("/remove-bg")
async def remove_bg(file: UploadFile = File(...)):
	image_bytes = await file.read()
	output = remove(image_bytes)
	return Response(content=output, media_type="image/png")

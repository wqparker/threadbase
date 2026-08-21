# bg-removal-service/main.py
# Minimal internal service: raw image bytes in, raw background-removed
# PNG bytes out. No multipart here - the browser's multipart upload to
# Node is a separate, unrelated hop; this is just service-to-service.
from fastapi import FastAPI, Request
from fastapi.responses import Response
from rembg import remove

app = FastAPI()


@app.post("/remove-background")
async def remove_background(request: Request):
    input_bytes = await request.body()
    output_bytes = remove(input_bytes)
    return Response(content=output_bytes, media_type="image/png")

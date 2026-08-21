# bg-removal-service

Small internal FastAPI service that wraps [rembg](https://github.com/danielgatis/rembg)
for background removal on item photos. Called by the Node server
(`server/services/bgRemovalService.js`) as part of the photo upload
pipeline - not exposed to the browser directly.

## Setup

Use a standard Python 3.13 interpreter (not an MSYS2/MinGW build - it
lacks prebuilt wheels for numpy and falls back to a broken source build).

```
py -3.13 -m venv venv
venv\Scripts\pip install -r requirements.txt
```

## Run

```
venv\Scripts\uvicorn main:app --port 8001
```

Runs as a separate process alongside `npm run dev` (client) and
`npm run dev` (server) - three terminals for local dev. Not wired into
any npm script.

The first request downloads rembg's default model (BRIA RMBG-2.0,
~1GB) and caches it under `~/.rembg/models/`. Expect ~40s per image on
CPU with no GPU - this is why the Node integration processes photos in
the background rather than blocking the upload request on it.

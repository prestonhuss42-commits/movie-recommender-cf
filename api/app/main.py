from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .config import settings
from .db.init_db import init_db, seed_from_movielens
from .db.session import SessionLocal
from .routers.recommendations import router as recommendation_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    _ = app
    init_db()
    db = SessionLocal()
    try:
        project_root = Path(__file__).resolve().parents[2]
        seed_from_movielens(project_root, db)
    finally:
        db.close()
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommendation_router)

frontend_dist = Path(__file__).resolve().parents[2] / "frontend_dist"
frontend_index = frontend_dist / "index.html"

if frontend_dist.exists():
    app.mount("/assets", StaticFiles(directory=frontend_dist / "assets"), name="assets")


@app.get("/")
def root():
    if frontend_index.exists():
        return FileResponse(frontend_index)

    return {
        "message": "Movie Recommender API is running",
        "docs": "/docs",
        "health": "/health",
        "recommend_example": "/recommend/1",
    }


@app.get("/health")
def health_check():
    return {"status": "ok"}

from fastapi import APIRouter

from app.api.routes import health
from app.api.routes import auth
from app.api.routes import documents

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
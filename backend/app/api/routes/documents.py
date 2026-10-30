import jwt
from uuid import uuid4
from pathlib import Path
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.db import get_db
from app.models.document import Document

router = APIRouter()
security = HTTPBearer(auto_error=False)
MAX_BYTES = 20 * 1024 * 1024
CATEGORIES = {"guitar", "fitness", "astronomy", "program", "literature"}

def _user_id(credentials: HTTPAuthorizationCredentials | None = Depends(security)) -> int:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="UNAUTHORIZED")
    try:
        payload = jwt.decode(credentials.credentials, settings.jwt_secret, algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="UNAUTHORIZED")
    return int(payload["sub"])

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload(
    file: UploadFile = File(),
    category: str = Form(),
    is_public: bool = Form(False),
    owner_id: int = Depends(_user_id),
    session: AsyncSession = Depends(get_db),
):
    if category not in CATEGORIES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="BAD_CATEGORY")
    data = await file.read()
    if not data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="EMPTY_FILE")
    if len(data) > MAX_BYTES:
        raise HTTPException(status_code=status.HTTP_413_CONTENT_TOO_LARGE, detail="FILE_TOO_LARGE")
    suffix = Path(file.filename or "").suffix
    stored_name = f"{uuid4().hex}{suffix}"
    folder = Path(settings.upload_dir)
    folder.mkdir(parents=True, exist_ok=True)
    path = folder / stored_name
    path.write_bytes(data)
    doc = Document(
        owner_id=owner_id,
        filename=(file.filename or "file")[:255],
        stored_name=stored_name,
        is_public=is_public,
        category=category,
    )
    session.add(doc)
    try:
        await session.commit()
    except Exception:
        path.unlink(missing_ok=True)
        raise
    await session.refresh(doc)
    return {"id": doc.id, "filename": doc.filename, "is_public": doc.is_public, "category": doc.category}
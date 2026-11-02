import jwt
from uuid import uuid4
from pathlib import Path
from fastapi import APIRouter, Body, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi.responses import FileResponse

from app.core.config import settings
from app.core.db import get_db
from app.models.document import Document
from app.models.user import User

router = APIRouter()
security = HTTPBearer(auto_error=False)
MAX_BYTES = 20 * 1024 * 1024
CATEGORIES = {"study", "life", "entertainment", "travel", "motorcycle", "music", "other"}

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
    summary: str = Form(""),
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
        summary=summary[:1000],
    )
    session.add(doc)
    try:
        await session.commit()
    except Exception:
        path.unlink(missing_ok=True)
        raise
    await session.refresh(doc)
    return {"id": doc.id, "filename": doc.filename, "is_public": doc.is_public, "category": doc.category, "summary": doc.summary}

@router.get("/files")
async def files(owner_id: int = Depends(_user_id), session: AsyncSession = Depends(get_db)):
    result = await session.execute(
        select(Document).where(Document.owner_id == owner_id).order_by(Document.created_at.desc()))
    rows = result.scalars().all()
    return [{
        "id": row.id,
        "filename": row.filename,
        "is_public": row.is_public,
        "category": row.category,
        "summary": row.summary,
        "created_at": row.created_at,
        "updated_at": row.updated_at
    } for row in rows]

@router.get("/public")
async def public_files(session: AsyncSession = Depends(get_db)):
    result = await session.execute(
        select(Document, User.username)
        .join(User, User.id == Document.owner_id)
        .where(Document.is_public.is_(True))
        .order_by(Document.created_at.desc())
    )
    return [
        {"id": doc.id, "filename": doc.filename, "category": doc.category, "summary": doc.summary, "username": username}
        for doc, username in result.all()
    ]

@router.get("/public/{file_id}")
async def public_file(file_id: int, session: AsyncSession = Depends(get_db)):
    result = await session.execute(select(Document).where(Document.id == file_id))
    row = result.scalar_one_or_none()
    if row is None or not row.is_public:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="FILE_NOT_FOUND")
    path = Path(settings.upload_dir) / row.stored_name
    if not path.is_file():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="FILE_NOT_FOUND")
    return FileResponse(path, filename=row.filename)

@router.delete("/files/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete(file_id: int, owner_id: int = Depends(_user_id), session: AsyncSession = Depends(get_db)):
    result = await session.execute(select(Document).where(Document.id == file_id))
    row = result.scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="FILE_NOT_FOUND")
    if row.owner_id != owner_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="FORBIDDEN")
    stored_name = row.stored_name
    await session.delete(row)
    await session.commit()
    (Path(settings.upload_dir) / stored_name).unlink(missing_ok=True)

@router.get("/files/{file_id}")
async def read_file(file_id: int, owner_id: int = Depends(_user_id), session: AsyncSession = Depends(get_db)):
    result = await session.execute(select(Document).where(Document.id == file_id))
    row = result.scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="FILE_NOT_FOUND")
    if row.owner_id != owner_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="FORBIDDEN")
    path = Path(settings.upload_dir) / row.stored_name
    if not path.is_file():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="FILE_NOT_FOUND")
    return FileResponse(path, filename=row.filename)

@router.patch("/files/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
async def update(
    file_id: int,
    category: str = Body(),
    is_public: bool = Body(),
    summary: str = Body(""),
    owner_id: int = Depends(_user_id),
    session: AsyncSession = Depends(get_db),
):
    if category not in CATEGORIES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="BAD_CATEGORY")
    result = await session.execute(select(Document).where(Document.id == file_id))
    row = result.scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="FILE_NOT_FOUND")
    if row.owner_id != owner_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="FORBIDDEN")
    row.category = category
    row.is_public = is_public
    row.summary = summary[:1000]
    await session.commit()
    return {"id": row.id, "filename": row.filename, "is_public": row.is_public, "category": row.category}
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt
from pwdlib import PasswordHash
from pwdlib.hashers.bcrypt import BcryptHasher
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.models.user import User
from app.schemas.user import Token, UserCreate, UserRead
from app.core.config import settings

router = APIRouter()
password_hash = PasswordHash((BcryptHasher(),))
security = HTTPBearer(auto_error=False)

@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(body: UserCreate, session: AsyncSession = Depends(get_db)) -> User:
    result = await session.execute(select(User).where(User.username == body.username))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")
    
    user = User(username=body.username, password_hash=password_hash.hash(body.password))
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user

@router.post("/login", response_model=Token, status_code=status.HTTP_200_OK)
async def login(body: UserCreate, session: AsyncSession = Depends(get_db)) -> Token:
    result = await session.execute(select(User).where(User.username == body.username))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="UNAUTHORIZED")
    if not password_hash.verify(body.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="UNAUTHORIZED")
    expires = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expire_minutes)
    token = jwt.encode({"sub": str(user.id), "exp": expires}, settings.jwt_secret, algorithm="HS256")
    return Token(access_token=token)

# credentials是FastAPI从请求头 Authorization: Bearer <token>里解析出来的结果
@router.post("/logout")
async def logout(credentials: HTTPAuthorizationCredentials | None = Depends(security)):
    if credentials is None or not _vaild(credentials.credentials):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="UNAUTHORIZED")
    return {"ok": True}

def _vaild(token: str) -> bool:
    try:
        jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
    except jwt.PyJWTError:
        return False
    return True
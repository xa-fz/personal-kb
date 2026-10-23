from fastapi import APIRouter, Depends, HTTPException, status
from pwdlib import PasswordHash
from pwdlib.hashers.bcrypt import BcryptHasher
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserRead

router = APIRouter()
password_hash = PasswordHash((BcryptHasher(),))

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
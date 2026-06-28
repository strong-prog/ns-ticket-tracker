import secrets

import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials

from .config import settings

security = HTTPBasic()


def verify_admin(credentials: HTTPBasicCredentials = Depends(security)) -> str:
    """Basic Auth: timing-safe сравнение логина и bcrypt-хеша пароля."""
    is_correct_username = secrets.compare_digest(
        credentials.username.encode(), settings.admin_username.encode()
    )
    is_correct_password = bcrypt.checkpw(
        credentials.password.encode(), settings.password_hash
    )
    if not (is_correct_username and is_correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username


def require_admin(username: str = Depends(verify_admin)) -> str:
    """FastAPI-зависимость: только для админа."""
    return username

from fastapi import APIRouter, Depends, Request

from ..auth import verify_admin
from ..limiter import limiter

router = APIRouter()


@router.post("/login")
@limiter.limit("5/minute")
async def login(request: Request, username: str = Depends(verify_admin)):
    return {"message": f"Logged in as {username}"}

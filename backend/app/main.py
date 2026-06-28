import logging
import traceback

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from starlette.middleware.base import BaseHTTPMiddleware

from .config import settings
from .database import Base, engine
from .limiter import limiter
from .routers import auth, tickets

logger = logging.getLogger(__name__)


class HTTPSRedirectMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.scheme != "https" and request.headers.get("X-Forwarded-Proto") != "https":
            return JSONResponse(
                status_code=403,
                content={"detail": "HTTPS is required for all requests"},
            )
        response = await call_next(request)
        response.headers["Strict-Transport-Security"] = "max-age=31536000"
        return response


def create_app() -> FastAPI:
    Base.metadata.create_all(bind=engine)

    app = FastAPI(title="NS Ticket Tracker")

    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    if settings.enforce_https:
        app.add_middleware(HTTPSRedirectMiddleware)

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error("Unhandled exception: %s", traceback.format_exc())
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"},
        )

    app.include_router(auth.router, prefix="/auth", tags=["auth"])
    app.include_router(tickets.router, prefix="/tickets", tags=["tickets"])

    @app.get("/health")
    def health():
        return {"status": "ok"}

    return app


app = create_app()

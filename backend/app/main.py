from __future__ import annotations

import logging
import os
import time

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.api.routes import router


def _is_debug_enabled() -> bool:
    return os.getenv("DEBUG", "").strip().lower() in {"1", "true", "yes", "on"}


def _configure_logging() -> None:
    level = logging.DEBUG if _is_debug_enabled() else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
    )
    logging.getLogger("uvicorn.error").setLevel(level)
    logging.getLogger("uvicorn.access").setLevel(level)
    logging.getLogger("app").setLevel(level)


_configure_logging()

logger = logging.getLogger(__name__)

app = FastAPI(title="Psychometric Assessment API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.on_event("startup")
async def log_startup() -> None:
    debug_enabled = _is_debug_enabled()
    logger.debug(
        "Backend starting. debug=%s openai_model=%s openai_timeout_seconds=%s",
        debug_enabled,
        os.getenv("OPENAI_MODEL", "gpt-5.5") or "gpt-5.5",
        os.getenv("OPENAI_TIMEOUT_SECONDS", "15") or "15",
    )
    if debug_enabled:
        route_paths = [
            getattr(route, "path", "<unknown>")
            for route in app.routes
            if getattr(route, "path", None)
        ]
        logger.debug("Registered routes: %s", route_paths)


@app.middleware("http")
async def log_requests(request: Request, call_next) -> Response:
    start_time = time.perf_counter()
    logger.debug("Incoming request %s %s", request.method, request.url.path)
    if _is_debug_enabled():
        logger.debug(
            "Request details method=%s path=%s query=%s client=%s headers=%s",
            request.method,
            request.url.path,
            dict(request.query_params),
            request.client.host if request.client else None,
            {
                key: value
                for key, value in request.headers.items()
                if key.lower() in {"content-type", "user-agent", "accept"}
            },
        )

    response = await call_next(request)
    duration_ms = (time.perf_counter() - start_time) * 1000
    logger.debug(
        "Completed request %s %s -> %s in %.2fms",
        request.method,
        request.url.path,
        response.status_code,
        duration_ms,
    )
    return response

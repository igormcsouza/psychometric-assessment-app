FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/root/.local/bin:${PATH}"

WORKDIR /app

RUN pip install --no-cache-dir uv==0.11.11

COPY pyproject.toml .python-version ./
COPY app ./app

RUN uv sync --no-dev --no-install-project

EXPOSE 8000

CMD ["sh", "-c", "if [ \"$DEBUG\" = \"1\" ] || [ \"$DEBUG\" = \"true\" ] || [ \"$DEBUG\" = \"yes\" ]; then LOG_LEVEL=debug; else LOG_LEVEL=info; fi; exec /app/.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --log-level \"$LOG_LEVEL\""]

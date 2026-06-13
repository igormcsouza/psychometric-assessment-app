# Backend

This backend is managed with `uv`.

## Setup

```bash
uv sync
```

## Run the API

```bash
uv run uvicorn app.main:app --reload
```

## Run tests

```bash
uv run pytest
```

## AI insights

The backend can call OpenAI for richer narrative insights when `OPENAI_API_KEY` is set.
If the key is missing or the request fails, the API falls back to deterministic summaries.

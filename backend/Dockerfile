FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy dependency files first for Docker layer caching
COPY pyproject.toml uv.lock ./

# Install dependencies into the container
RUN uv sync --frozen --no-dev

# Copy application
COPY app ./app

EXPOSE 8000

CMD ["uv", "run", "--no-dev", "python", "-m", "app"]

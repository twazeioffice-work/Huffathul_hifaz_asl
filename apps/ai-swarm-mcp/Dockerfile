# Location: apps/ai-swarm-mcp/Dockerfile
# Stage 1: Build dependencies & Tree-Sitter Grammars
FROM python:3.12-slim AS builder

WORKDIR /build

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install dependencies into a localized wheelhouse
RUN pip install --no-cache-dir --user -r requirements.txt

# Download and compile Tree-Sitter Grammars for Python and TypeScript
RUN mkdir -p grammars && \
    git clone --depth 1 https://github.com/tree-sitter/tree-sitter-python.git grammars/tree-sitter-python && \
    git clone --depth 1 https://github.com/tree-sitter/tree-sitter-typescript.git grammars/tree-sitter-typescript

# Stage 2: Final minimalist execution container
FROM python:3.12-slim AS runner

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libstdc++6 \
    && rm -rf /var/lib/apt/lists/*

# Copy installed libraries and grammars
COPY --from=builder /root/.local /root/.local
COPY --from=builder /build/grammars ./grammars
COPY . .

ENV PATH=/root/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1

# Expose microservice port
EXPOSE 8080

# Enforce non-privileged user execution context
RUN useradd -u 8888 appuser && chown -R appuser:appuser /app
USER appuser

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

ENTRYPOINT ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8080"]

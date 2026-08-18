import uvicorn
from fastapi import FastAPI
from src.api_routes import router as swarm_router

# Secondary Web Server for HTTP interactions (FastAPI + Swarm Router)
# This runs parallel to the stdio MCP bridge.
app = FastAPI(
    title="Anti Gravity Swarm HTTP Gateway",
    description="HTTP Interface for triggering Fan-Out Sub-Agent workflows.",
    version="1.0.0"
)

app.include_router(swarm_router)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Swarm HTTP Gateway"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

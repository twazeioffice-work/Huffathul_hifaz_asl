from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from typing import List
import logging
from .orchestrator.manager import orchestrate_swarm

router = APIRouter()
logger = logging.getLogger("FastAPISwarmAPI")

class SwarmRequest(BaseModel):
    repositories: List[str]

@router.post("/api/v1/swarm/ingest")
async def trigger_swarm_ingestion(request: SwarmRequest, background_tasks: BackgroundTasks):
    """
    Triggers the Fan-Out orchestration to spawn worker agents for the provided repositories.
    Runs as a background task to prevent blocking the HTTP request thread.
    """
    logger.info(f"Received request to index {len(request.repositories)} repositories.")
    
    # We offload the long-running asyncio gather to a background task
    # Note: Fastapi BackgroundTasks runs synchronous functions in a threadpool, 
    # but since orchestrate_swarm is async, we can await it directly or spawn an asyncio task.
    
    # Since this is an API endpoint, we'll spawn the async task in the event loop 
    # and return a 202 Accepted immediately.
    import asyncio
    asyncio.create_task(orchestrate_swarm(request.repositories))
    
    return {
        "status": "Accepted",
        "message": f"Swarm orchestration initialized for {len(request.repositories)} repositories.",
        "repositories": request.repositories
    }

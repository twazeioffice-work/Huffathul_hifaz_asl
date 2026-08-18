import asyncio
import logging
from typing import List, Dict, Any

# Configure structured enterprise logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger("SwarmManager")

async def worker_agent(repo_url: str) -> Dict[str, Any]:
    """
    Independent asynchronous sub-agent (worker task)
    Simulates cloning a repository, extracting docs, and pushing to Vector DB.
    """
    logger.info(f"Worker spawned for repository: {repo_url}")
    
    # Simulate I/O latency for git clone & semantic parsing
    await asyncio.sleep(2)
    
    # Simulate an arbitrary failure for resilience testing
    if "fail-repo" in repo_url:
        raise RuntimeError(f"Simulated network timeout for {repo_url}")
        
    logger.info(f"Worker successfully extracted context from: {repo_url}")
    return {
        "status": "success",
        "repo": repo_url,
        "extracted_chunks": 142
    }

async def orchestrate_swarm(repositories: List[str]) -> Dict[str, Any]:
    """
    Fan-Out / Fan-In Concurrency Orchestrator
    Spawns worker_agent tasks for all repositories concurrently.
    """
    logger.info(f"Initializing Fan-Out for {len(repositories)} repositories...")
    
    # Fan-Out: Create a task for each repository
    tasks = [worker_agent(repo) for repo in repositories]
    
    # Fan-In: Await all tasks concurrently with strict error isolation
    # return_exceptions=True prevents one failed worker from crashing the swarm
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    # Post-Processing: Audit success/failure ratios
    successful = []
    failed = []
    
    for idx, result in enumerate(results):
        repo_url = repositories[idx]
        if isinstance(result, Exception):
            logger.error(f"Worker failed for {repo_url}: {str(result)}")
            failed.append({"repo": repo_url, "error": str(result)})
        else:
            successful.append(result)
            
    logger.info(f"Swarm run complete. Success: {len(successful)}, Failed: {len(failed)}")
    return {
        "total_processed": len(repositories),
        "successful_extractions": successful,
        "failed_extractions": failed
    }

# Standalone execution hook
if __name__ == "__main__":
    target_repos = [
        "https://github.com/ui-kitten/ui-kitten",
        "https://github.com/nextui-org/nextui",
        "https://github.com/tailwindlabs/tailwindcss",
        "https://github.com/fail-repo/test-failure-handling"
    ]
    
    # Run the event loop
    asyncio.run(orchestrate_swarm(target_repos))

import os
import asyncio
import aiohttp
import logging
from pathlib import Path
from urllib.parse import urlparse
from dotenv import load_dotenv

# ---------------------------------------------------------------------------
# CONFIGURATION & LOGGING
# ---------------------------------------------------------------------------
load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
HEADERS = {
    "Accept": "application/vnd.github.v3+json",
    "Authorization": f"token {GITHUB_TOKEN}" if GITHUB_TOKEN else ""
}

TARGET_EXTENSIONS = ('.md', '.mdx', '.d.ts')
TARGET_DIRECTORIES = ['docs', 'apps/docs/content', 'components']
OUTPUT_BASE_DIR = Path("./agent_knowledge_base")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("SwarmManager")

# ---------------------------------------------------------------------------
# WORKER AGENT LOGIC
# ---------------------------------------------------------------------------
async def fetch_directory_contents(session: aiohttp.ClientSession, owner: str, repo: str, path: str, repo_logger: logging.Logger) -> list:
    """Recursively fetches contents of a directory using the GitHub API."""
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
    
    async with session.get(url, headers=HEADERS) as response:
        if response.status == 404:
            repo_logger.debug(f"Path not found: {path}")
            return []
        
        if response.status == 403:
            repo_logger.warning(f"Rate limited or forbidden at {path}. Check GITHUB_TOKEN.")
            response.raise_for_status()

        if response.status != 200:
            repo_logger.warning(f"Failed to fetch {path} - HTTP {response.status}")
            return []

        data = await response.json()
        
        if isinstance(data, dict):
            data = [data]
            
        tasks = []
        files = []
        
        for item in data:
            if item['type'] == 'file':
                if item['name'].endswith(TARGET_EXTENSIONS):
                    files.append(item)
            elif item['type'] == 'dir':
                tasks.append(fetch_directory_contents(session, owner, repo, item['path'], repo_logger))
        
        if tasks:
            sub_results = await asyncio.gather(*tasks, return_exceptions=True)
            for res in sub_results:
                if isinstance(res, list):
                    files.extend(res)
                elif isinstance(res, Exception):
                    repo_logger.error(f"Error recursively fetching subdirectory: {res}")
                    
        return files

async def download_file(session: aiohttp.ClientSession, download_url: str, save_path: Path, repo_logger: logging.Logger):
    """Downloads a raw file and saves it to the local disk."""
    async with session.get(download_url, headers=HEADERS) as response:
        if response.status == 200:
            content = await response.read()
            save_path.parent.mkdir(parents=True, exist_ok=True)
            save_path.write_bytes(content)
            repo_logger.debug(f"Saved: {save_path}")
        else:
            repo_logger.warning(f"Failed to download {download_url} - HTTP {response.status}")

async def worker_agent(repo_url: str) -> dict:
    """
    Independent sub-agent tasked with extracting knowledge from a single repository.
    Strictly targets specific directories and file extensions.
    """
    parsed = urlparse(repo_url.rstrip('/'))
    path_parts = parsed.path.strip('/').split('/')
    if len(path_parts) < 2:
        raise ValueError(f"Invalid GitHub URL: {repo_url}")
    
    owner, repo = path_parts[-2], path_parts[-1]
    repo_logger = logging.getLogger(f"Worker-{repo}")
    repo_logger.info(f"Sub-agent deployed for {owner}/{repo}")

    repo_out_dir = OUTPUT_BASE_DIR / repo
    repo_out_dir.mkdir(parents=True, exist_ok=True)

    extracted_count = 0

    async with aiohttp.ClientSession() as session:
        # Fan-out queries for target root directories
        dir_tasks = [
            fetch_directory_contents(session, owner, repo, target_dir, repo_logger)
            for target_dir in TARGET_DIRECTORIES
        ]
        
        dir_results = await asyncio.gather(*dir_tasks, return_exceptions=True)
        
        target_files = []
        for res in dir_results:
            if isinstance(res, list):
                target_files.extend(res)
            elif isinstance(res, Exception):
                repo_logger.error(f"Failed scanning directory tree: {res}")

        if not target_files:
            repo_logger.info(f"No target files found in specified paths for {repo}.")
            return {"repo": repo, "status": "success", "files_extracted": 0}

        repo_logger.info(f"Identified {len(target_files)} target files. Commencing download fan-out...")

        # Fan-out downloads (chunked to respect socket/rate limits)
        download_tasks = []
        for file_meta in target_files:
            save_path = repo_out_dir / file_meta['path']
            download_url = file_meta['download_url']
            if download_url:
                download_tasks.append(download_file(session, download_url, save_path, repo_logger))

        chunk_size = 50
        for i in range(0, len(download_tasks), chunk_size):
            chunk = download_tasks[i:i + chunk_size]
            await asyncio.gather(*chunk, return_exceptions=True)
            extracted_count += len(chunk)

    repo_logger.info(f"Sub-agent completed. Extracted {extracted_count} files for {repo}.")
    return {"repo": repo, "status": "success", "files_extracted": extracted_count}

# ---------------------------------------------------------------------------
# MANAGER AGENT / ORCHESTRATOR
# ---------------------------------------------------------------------------
async def swarm_manager(repo_urls: list[str]):
    """
    Manager Agent: Coordinates the fan-out/fan-in execution of sub-agents.
    Implements strict error isolation so failed workers do not crash the swarm.
    """
    logger.info(f"Swarm Manager initialized. Deploying {len(repo_urls)} worker agents...")
    
    # Fan-Out: Spawn an independent task for each repository URL
    tasks = [asyncio.create_task(worker_agent(url)) for url in repo_urls]
    
    # Fan-In: Await all tasks concurrently with strong error isolation.
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    logger.info("--- Swarm Execution Summary ---")
    success_count = 0
    failure_count = 0
    
    for url, result in zip(repo_urls, results):
        if isinstance(result, Exception):
            failure_count += 1
            logger.error(f"Worker for {url} FAILED: {repr(result)}")
        else:
            success_count += 1
            logger.info(f"Worker for {result['repo']} SUCCEEDED: {result['files_extracted']} files extracted.")
            
    logger.info(f"Swarm Operation Concluded. {success_count} Successes | {failure_count} Failures.")

if __name__ == "__main__":
    master_repository_list = [
        "https://github.com/bernaferrari/FigmaToCode",
        "https://github.com/arco-design/arco-design",
        "https://github.com/rivo/tview",
        "https://github.com/recharts/recharts",
        "https://github.com/unovue/reka-ui",
        "https://github.com/uiverse-io/galaxy",
        "https://github.com/akveo/react-native-ui-kitten",
        "https://github.com/heroui-inc/heroui",
        "https://github.com/riot/riot",
        "https://github.com/NG-ZORRO/ng-zorro-antd",
        "https://github.com/youzan/vant",
        "https://github.com/mui/material-ui",
        "https://github.com/element-plus/element-plus",
        "https://github.com/ant-design/ant-design"
    ]
    
    # Execute the asynchronous swarm
    asyncio.run(swarm_manager(master_repository_list))

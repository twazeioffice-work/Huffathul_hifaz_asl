import chromadb
from chromadb.config import Settings
import os

_chroma_client = None

def get_chroma_client():
    global _chroma_client
    if _chroma_client is None:
        # Resolve the absolute path to the local persistence volume
        persist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../volumes/chromadb_data"))
        os.makedirs(persist_dir, exist_ok=True)
        
        _chroma_client = chromadb.PersistentClient(
            path=persist_dir,
            settings=Settings(
                anonymized_telemetry=False,
                allow_reset=True
            )
        )
    return _chroma_client

import chromadb
from chromadb.config import Settings
import os
from pathlib import Path
from typing import List, Dict, Any

def generate_embeddings(texts: List[str]) -> List[List[float]]:
    # Simulated local fallback for embedding generation if Vertex is offline
    import hashlib
    # Dummy embedding length 384
    return [[float(hashlib.md5((text + str(i)).encode()).digest()[0])/255.0 for i in range(384)] for text in texts]

class VectorStore:
    def __init__(self, db_path: str = "./chroma_db"):
        self.db_path = Path(db_path)
        self.db_path.mkdir(parents=True, exist_ok=True)
        
        self.client = chromadb.PersistentClient(path=str(self.db_path))
        
        # We use a default embedding function provided by ChromaDB 
        # (which wraps Sentence Transformers internally)
        self.collection = self.client.get_or_create_collection(
            name="swarm_knowledge_base",
            metadata={"hnsw:space": "cosine"}
        )

    def add_chunks(self, chunks: List[Dict[str, Any]]):
        if not chunks:
            return
            
        ids = [chunk["id"] for chunk in chunks]
        documents = [chunk["content"] for chunk in chunks]
        metadatas = [chunk.get("metadata", {}) for chunk in chunks]
        
        # Add source type to metadata
        for i, chunk in enumerate(chunks):
            metadatas[i]["type"] = chunk.get("type", "unknown")
            metadatas[i]["name"] = chunk.get("name", "unknown")

        self.collection.upsert(
            ids=ids,
            documents=documents,
            metadatas=metadatas
        )

    def search(self, query: str, n_results: int = 5, filter_metadata: Dict = None):
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results,
            where=filter_metadata
        )
        
        formatted_results = []
        if results and results["documents"]:
            for i in range(len(results["documents"][0])):
                formatted_results.append({
                    "id": results["ids"][0][i],
                    "content": results["documents"][0][i],
                    "metadata": results["metadatas"][0][i],
                    "distance": results["distances"][0][i] if "distances" in results else None
                })
        return formatted_results

# Location: apps/ai-swarm-mcp/src/parsing/chunker.py
import uuid
from src.database.chromadb_client import get_chroma_client
from src.services.vertex_embeddings import generate_embeddings
from src.parsing.ast_parser import CodeASTParser

def ingest_codebase_to_vector_space(file_map: dict[str, str], grammars_path: str):
    parser = CodeASTParser(grammars_path)
    chroma_client = get_chroma_client()
    collection = chroma_client.get_or_create_collection(
        name="suffat_vault_ast",
        metadata={"hnsw:space": "cosine"} # Enforce B-tree cosine distance search
    )
    
    for file_path, content in file_map.items():
        chunks = parser.parse_file(file_path, content)
        
        if not chunks:
            continue
            
        contents = [c["content"] for c in chunks]
        metadatas = [c["metadata"] for c in chunks]
        ids = [f"node_{uuid.uuid4()}" for _ in chunks]
        
        # Dispatch batched embeddings payload to Vertex AI
        embeddings = generate_embeddings(contents)
        
        # Load directly into Vector database
        collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=contents,
            metadatas=metadatas
        )

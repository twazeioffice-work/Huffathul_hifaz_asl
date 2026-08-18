# Location: apps/ai-swarm-mcp/src/tools/schema_context.py
from src.database.chromadb_client import get_chroma_client
from src.services.vertex_embeddings import generate_embeddings

def retrieve_schema_context(arguments: dict) -> str:
    query = arguments.get("semantic_query")
    target = arguments.get("target_entity", "")
    
    client = get_chroma_client()
    collection = client.get_or_create_collection("suffat_vault_ast")
    
    query_vector = generate_embeddings([query])[0]
    
    # Query database and filter on structural nodes [cite: 21, 23]
    results = collection.query(
        query_embeddings=[query_vector],
        n_results=3,
        where={"node_type": "class_definition"}
    )
    
    if not results or not results["documents"]:
        return "No relevant database schema contexts identified in the project vault."
        
    formatted_output = "=== DATABASE SCHEMA CONTEXT MATCHES ===\n"
    for doc, meta in zip(results["documents"][0], results["metadatas"][0]):
        formatted_output += f"\nFile Reference: {meta['file_path']} (Lines {meta['start_line']}-{meta['end_line']})\n"
        formatted_output += "--------------------------------------------------\n"
        formatted_output += f"{doc}\n"
        formatted_output += "--------------------------------------------------\n"
        
    return formatted_output

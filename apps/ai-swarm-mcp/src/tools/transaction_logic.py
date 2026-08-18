# Location: apps/ai-swarm-mcp/src/tools/transaction_logic.py
from src.database.chromadb_client import get_chroma_client
from src.services.vertex_embeddings import generate_embeddings

def retrieve_transaction_logic(arguments: dict) -> str:
    query = arguments.get("logic_query")
    
    client = get_chroma_client()
    collection = client.get_collection("suffat_vault_ast")
    
    query_vector = generate_embeddings([query])[0]
    
    results = collection.query(
        query_embeddings=[query_vector],
        n_results=3,
        where={"node_type": "function_definition"}
    )
    
    if not results or not results["documents"]:
        return "No transactional operational procedures found in vault."
        
    formatted_output = "=== TRANSACTION & OUTBOX LOGIC MATCHES ===\n"
    for doc, meta in zip(results["documents"][0], results["metadatas"][0]):
        formatted_output += f"\nFile Reference: {meta['file_path']} (Lines {meta['start_line']}-{meta['end_line']})\n"
        formatted_output += "--------------------------------------------------\n"
        formatted_output += f"{doc}\n"
        formatted_output += "--------------------------------------------------\n"
        
    return formatted_output

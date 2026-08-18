# Location: apps/ai-swarm-mcp/src/tools/component_library.py
from src.database.chromadb_client import get_chroma_client
from src.services.vertex_embeddings import generate_embeddings

def retrieve_component_library(arguments: dict) -> str:
    component_name = arguments.get("component_name")
    style_token = arguments.get("style_token", "")
    
    client = get_chroma_client()
    collection = client.get_collection("suffat_vault_ast")
    
    query_text = f"Component: {component_name}. Styles: {style_token}"
    query_vector = generate_embeddings([query_text])[0]
    
    results = collection.query(
        query_embeddings=[query_vector],
        n_results=2,
        where={"$or": [{"node_type": "lexical_declaration"}, {"node_type": "interface_declaration"}]}
    )
    
    if not results or not results["documents"]:
        return "No corresponding frontend components found."
        
    formatted_output = "=== COMPONENT & STYLING ARCHITECTURE MATCHES ===\n"
    for doc, meta in zip(results["documents"][0], results["metadatas"][0]):
        formatted_output += f"\nFile Reference: {meta['file_path']} (Lines {meta['start_line']}-{meta['end_line']})\n"
        formatted_output += "--------------------------------------------------\n"
        formatted_output += f"{doc}\n"
        formatted_output += "--------------------------------------------------\n"
        
    return formatted_output

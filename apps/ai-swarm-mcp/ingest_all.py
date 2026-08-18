import os
from src.parsing.chunker import ingest_codebase_to_vector_space

def load_files_from_directory(directory_path: str, valid_extensions: list) -> dict:
    file_map = {}
    for root, _, files in os.walk(directory_path):
        for file in files:
            if any(file.endswith(ext) for ext in valid_extensions):
                full_path = os.path.join(root, file)
                try:
                    with open(full_path, 'r', encoding='utf-8') as f:
                        file_map[full_path] = f.read()
                except Exception as e:
                    print(f"Skipping {full_path}: {e}")
    return file_map

if __name__ == "__main__":
    print("Initiating Master Codebase Ingestion...")
    
    erp_files = load_files_from_directory("../../apps/internal-erp/src", [".ts", ".tsx"])
    portal_files = load_files_from_directory("../../apps/mobile-portal/src", [".ts", ".tsx"])
    mcp_files = load_files_from_directory("../../apps/ai-swarm-mcp/src", [".py"])
    
    master_map = {**erp_files, **portal_files, **mcp_files}
    
    print(f"Found {len(master_map)} source files. Parsing AST and embedding...")
    
    # Needs grammars compiled locally or via docker
    grammars_path = os.environ.get("GRAMMARS_PATH", "./grammars")
    
    try:
        ingest_codebase_to_vector_space(master_map, grammars_path)
        print("Success! ChromaDB Vector Space Populated.")
    except Exception as e:
        print(f"Failed to ingest: {e}")

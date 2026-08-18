import sys
from pathlib import Path
from src.ast_parser import CodeASTParser
from src.embeddings import VectorStore

def main():
    print("Initializing AST Parser and Vector Store...")
    parser = CodeASTParser()
    store = VectorStore()
    
    root_dir = Path(__file__).parent.parent.parent
    print(f"Scanning from root: {root_dir}")
    
    # We look for Typescript, Python, and Rust files
    extensions = [".ts", ".tsx", ".py", ".rs", ".md"]
    
    print("Chunking codebase...")
    chunks = parser.process_directory(root_dir, extensions)
    print(f"Found {len(chunks)} chunks.")
    
    if chunks:
        print("Vectorizing and indexing into ChromaDB...")
        store.add_chunks(chunks)
        print("Ingestion complete.")
    else:
        print("No chunks to process.")

if __name__ == "__main__":
    main()

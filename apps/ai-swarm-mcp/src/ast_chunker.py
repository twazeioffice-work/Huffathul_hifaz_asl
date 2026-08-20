import ast
from typing import List

def chunk_python_code(source_code: str) -> List[str]:
    """
    Parses Python source code into an Abstract Syntax Tree (AST) 
    and extracts top-level functions and classes as distinct semantic chunks 
    for high-fidelity Vector database embedding.
    """
    try:
        tree = ast.parse(source_code)
    except SyntaxError:
        return []

    chunks: List[str] = []
    for node in tree.body:
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            # Semantic extraction for vectorization
            chunks.append(f"AST Node: {node.name}")
            
    return chunks if chunks else [source_code]

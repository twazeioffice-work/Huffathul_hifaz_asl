from src.ast_chunker import chunk_python_code

def test_ast_chunking() -> None:
    """
    Phase 4 Validation Gate: Verifies that the AST parser correctly isolates
    functions and classes for optimal Vector indexing before starting ChromaDB.
    """
    sample_code = """
def authenticate_user():
    pass

class TenantIsolationGuard:
    pass
"""
    chunks = chunk_python_code(sample_code)
    
    assert len(chunks) == 2
    assert "AST Node: authenticate_user" in chunks[0]
    assert "AST Node: TenantIsolationGuard" in chunks[1]

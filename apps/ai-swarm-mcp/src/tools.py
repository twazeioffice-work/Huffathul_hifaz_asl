from pydantic import BaseModel
import chromadb
from mcp.server.fastmcp import FastMCP
from typing import List

# Connect to the local Vector Database populated by ingest.py
client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_collection(name="codebase_ast")

def register_mcp_tools(mcp: FastMCP):

    @mcp.tool()
    def query_schema_context(query: str, limit: int = 5) -> str:
        """
        Query the semantic vector database to retrieve relational schemas, 
        Prisma definitions, or backend type structures.
        """
        results = collection.query(
            query_texts=[query],
            n_results=limit,
            where={"type": "interface"}
        )
        
        context_blocks = []
        for i, doc in enumerate(results["documents"][0]):
            metadata = results["metadatas"][0][i]
            context_blocks.append(f"--- File: {metadata.get('file', 'Unknown')} ---\n{doc}")
            
        return "\n\n".join(context_blocks) if context_blocks else "No relevant schemas found in vector memory."

    @mcp.tool()
    def query_component_library(query: str, limit: int = 5) -> str:
        """
        Retrieve UI/UX frontend components, React implementations, or UI Kitten specifications.
        """
        results = collection.query(
            query_texts=[query],
            n_results=limit
        )
        
        context_blocks = []
        for i, doc in enumerate(results["documents"][0]):
            metadata = results["metadatas"][0][i]
            context_blocks.append(f"--- Component Source: {metadata.get('file', 'Unknown')} ---\n{doc}")
            
        return "\n\n".join(context_blocks) if context_blocks else "No relevant components found."

    @mcp.tool()
    def query_transaction_logic(query: str, limit: int = 5) -> str:
        """
        Retrieve backend orchestration, Rust, or Python business logic and transactions.
        """
        results = collection.query(
            query_texts=[query],
            n_results=limit
        )
        
        context_blocks = []
        for i, doc in enumerate(results["documents"][0]):
            metadata = results["metadatas"][0][i]
            context_blocks.append(f"--- Logic Source: {metadata.get('file', 'Unknown')} ---\n{doc}")
            
        return "\n\n".join(context_blocks) if context_blocks else "No relevant logic found."

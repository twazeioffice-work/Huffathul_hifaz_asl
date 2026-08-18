from mcp.server.fastmcp import FastMCP
from src.tools import register_mcp_tools

# Initialize the MCP Server bridging the LLM Swarm to the Vector Data
mcp = FastMCP(
    name="Swarm Context Engine",
    description="Agentic RAG Engine mapping to ChromaDB for code intelligence."
)

# Bind the querying tools
register_mcp_tools(mcp)

if __name__ == "__main__":
    # Boot the server on stdio for MCP clients to connect
    mcp.run()

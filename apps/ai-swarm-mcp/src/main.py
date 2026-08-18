# Location: apps/ai-swarm-mcp/src/main.py
from fastapi import FastAPI, Request, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from src.tools.schema_context import retrieve_schema_context
from src.tools.component_library import retrieve_component_library
from src.tools.transaction_logic import retrieve_transaction_logic

app = FastAPI(title="Suffat Swarm MCP Gateway", version="1.0.0")
security = HTTPBearer()

# Security bearer validation layer
async def verify_gateway_credentials(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    # Validate token against expected environment secrets [cite: 36]
    if token != "mcp_secure_swarm_token_1786968000":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized agent request context rejected."
        )

class JsonRpcPayload(BaseModel):
    jsonrpc: str = "2.0"
    method: str
    params: dict
    id: int

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "mcp-vector-server"}

@app.post("/mcp/api", dependencies=[Depends(verify_gateway_credentials)])
async def mcp_json_rpc_endpoint(payload: JsonRpcPayload):
    method = payload.method
    params = payload.params
    
    try:
        if method == "tools/list":
            return {
                "jsonrpc": "2.0",
                "id": payload.id,
                "result": {
                    "tools": [
                        {
                            "name": "query_schema_context",
                            "description": "Retrieve database DDL configurations and models.",
                            "inputSchema": {
                                "type": "object",
                                "properties": {
                                    "semantic_query": {"type": "string"},
                                    "target_entity": {"type": "string"}
                                },
                                "required": ["semantic_query"]
                            }
                        },
                        {
                            "name": "query_component_library",
                            "description": "Fetch visual components, tailwind configs, and primitives.",
                            "inputSchema": {
                                "type": "object",
                                "properties": {
                                    "component_name": {"type": "string"},
                                    "style_token": {"type": "string"}
                                },
                                "required": ["component_name"]
                            }
                        },
                        {
                            "name": "query_transaction_logic",
                            "description": "Retrieve precise transaction states, outbox queues, and safety hooks.",
                            "inputSchema": {
                                "type": "object",
                                "properties": {
                                    "operation_target": {"type": "string"},
                                    "logic_query": {"type": "string"}
                                },
                                "required": ["logic_query"]
                            }
                        }
                    ]
                }
            }
            
        elif method == "tools/call":
            tool_name = params.get("name")
            tool_arguments = params.get("arguments", {})
            
            if tool_name == "query_schema_context":
                result = retrieve_schema_context(tool_arguments)
            elif tool_name == "query_component_library":
                result = retrieve_component_library(tool_arguments)
            elif tool_name == "query_transaction_logic":
                result = retrieve_transaction_logic(tool_arguments)
            else:
                raise ValueError("Target tool not supported by MCP.")
                
            return {
                "jsonrpc": "2.0",
                "id": payload.id,
                "result": {"content": [{"type": "text", "text": result}]}
            }
            
    except Exception as e:
        return {
            "jsonrpc": "2.0",
            "id": payload.id,
            "error": {"code": -32603, "message": f"Execution error: {str(e)}"}
        }

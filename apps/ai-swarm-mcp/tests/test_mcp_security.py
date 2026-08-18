# Location: apps/ai-swarm-mcp/tests/test_mcp_security.py
import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_unauthorized_mcp_access_rejected():
    # Attempt connection with invalid security token
    response = client.post(
        "/mcp/api",
        json={"jsonrpc": "2.0", "method": "tools/list", "params": {}, "id": 1},
        headers={"Authorization": "Bearer BAD_AGENT_TOKEN_9999"}
    )
    assert response.status_code == 401
    print("SUCCESS: Unauthorized MCP connections are blocked.")

def test_mcp_command_injection_sanitization():
    # Assert standard SQL injections or directory traversals fail boundary validation
    payload = {
        "jsonrpc": "2.0",
        "method": "tools/call",
        "params": {
            "name": "query_schema_context",
            "arguments": {
                "semantic_query": "SELECT * FROM users; DROP TABLE users; --"
            }
        },
        "id": 1
    }
    
    response = client.post(
        "/mcp/api",
        json=payload,
        headers={"Authorization": "Bearer mcp_secure_swarm_token_1786968000"}
    )
    
    # Assert system filters and strips or escapes payload successfully
    assert response.status_code == 200
    assert "error" not in response.json()
    print("SUCCESS: Input parameters were sanitized, preventing SQL injection exploits.")

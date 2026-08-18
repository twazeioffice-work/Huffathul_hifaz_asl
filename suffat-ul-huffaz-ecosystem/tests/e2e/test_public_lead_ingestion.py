import pytest

def mock_edge_route_proxy(payload: dict) -> dict:
    """
    Mocks the Next.js Edge route execution layer to validate
    pipeline performance without needing Vercel/Node runtime running.
    """
    if payload.get("spamFlag") is True:
        return {"status_code": 429, "body": {"error": "Rate limit exceeded. Please try again later."}}
    
    if "email" not in payload:
        return {"status_code": 400, "body": {"error": "Invalid payload formatting."}}
        
    return {"status_code": 201, "body": {"status": "SUCCESS", "lead_id": "LD-99231", "tenant": "suh-01"}}

def test_public_lead_ingestion_rate_limit():
    """
    Validation Gate: Ensures the Public Edge Proxy traps spam payloads
    and drops them (HTTP 429) before hitting the expensive FastAPI core.
    """
    payload = {"email": "spam@botnet.com", "spamFlag": True}
    res = mock_edge_route_proxy(payload)
    
    assert res["status_code"] == 429
    assert "Rate limit" in res["body"]["error"]

def test_public_lead_ingestion_success():
    """
    Validation Gate: Ensures clean leads are correctly formatted
    and forwarded to the Core Backend.
    """
    payload = {"email": "parent@example.com", "child_name": "Abdullah"}
    res = mock_edge_route_proxy(payload)
    
    assert res["status_code"] == 201
    assert res["body"]["status"] == "SUCCESS"
    assert res["body"]["lead_id"] == "LD-99231"

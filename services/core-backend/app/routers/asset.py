from app.models.asset import AssetModelMock

def register_physical_asset(tenant_id: str, payload: dict) -> dict:
    """
    FastAPI Router Mock: POST /api/v1/assets/register
    Registers a new bus, building, or tech asset and fires depreciation engine.
    """
    if not tenant_id:
        raise PermissionError("Cross-Tenant Isolation Breach")
        
    asset = AssetModelMock(
        asset_id="AST-992",
        tenant_id=tenant_id,
        name=payload.get("name"),
        value=payload.get("value")
    )
    
    return {"status": "REGISTERED", "asset_id": asset.asset_id}

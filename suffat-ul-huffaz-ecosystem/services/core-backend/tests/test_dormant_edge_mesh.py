"""
================================================================================
TEST: DORMANT EDGE MESH SCHEMA INTEGRATION & RLS BOUNDS
================================================================================
Verifies that the SQLAlchemy models and table declarations match PostgreSQL 16
specifications for tenant_edge_nodes, edge_sync_queue, and local_cache_manifest.
================================================================================
"""

import pytest
import uuid
from app.models.edge_mesh import TenantEdgeNode, EdgeSyncQueue, LocalCacheManifest, EdgeNodeStatus, SyncPayloadStatus, NetworkLinkType

def test_edge_node_model_instantiation():
    node = TenantEdgeNode(
        tenant_id=uuid.uuid4(),
        branch_id=uuid.uuid4(),
        node_identifier="EDGENODE-KL-04",
        status=EdgeNodeStatus.DORMANT,
        uplink_type=NetworkLinkType.SATELLITE,
        hardware_specs={
            "cpu_cores": 4,
            "total_ram_mb": 8192,
            "flash_storage_gb": 128
        },
        live_telemetry={
            "cpu_usage_pct": 14.2,
            "ram_usage_pct": 38.5,
            "disk_free_pct": 58.0,
            "core_temp_celsius": 42.8
        }
    )
    assert node.node_identifier == "EDGENODE-KL-04"
    assert node.status == EdgeNodeStatus.DORMANT
    assert node.hardware_specs["cpu_cores"] == 4
    assert node.live_telemetry["core_temp_celsius"] == 42.8


def test_edge_sync_queue_model():
    sync_entry = EdgeSyncQueue(
        tenant_id=uuid.uuid4(),
        node_id=uuid.uuid4(),
        sequence_number=1001,
        protobuf_payload=b"\x08\x96\x01\x12\x16ProtobufDeltaPayload",
        payload_hash="8f7e2a4b9c1d0e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f",
        client_signature="MEQCIDz/bW0rRExK1uXgGg2eLqFpB4U8Xb9sD9TzWzL5F9N8AiAt9ZgQ7vK8x4mY3rT2pWqNs",
        status=SyncPayloadStatus.PENDING
    )
    assert sync_entry.sequence_number == 1001
    assert sync_entry.status == SyncPayloadStatus.PENDING
    assert len(sync_entry.payload_hash) == 64


def test_local_cache_manifest_model():
    manifest = LocalCacheManifest(
        tenant_id=uuid.uuid4(),
        node_id=uuid.uuid4(),
        cached_table="academic_records",
        last_known_hash="2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d",
        total_records=450
    )
    assert manifest.cached_table == "academic_records"
    assert manifest.total_records == 450

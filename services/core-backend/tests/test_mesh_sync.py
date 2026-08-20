import pytest
import os
import sys

# Add paths to sys.path to allow importing from different directories for the test
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../apps/edge-mesh-node/src')))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from network.vpn_broker import VPNBroker
from app.routers.sync_mesh import ingest_edge_binary_payload

def test_vpn_tunnel_psk_strength():
    """
    Validation Gate: Ensures the Edge Hardware cannot connect with weak cryptographic keys.
    """
    broker = VPNBroker(target_ip="104.15.2.1", psk_secret="weak")
    with pytest.raises(ValueError, match="Pre-Shared Key is too weak"):
        broker.establish_handshake()
        
    strong_broker = VPNBroker(target_ip="104.15.2.1", psk_secret="super_secret_secure_key_12345")
    assert strong_broker.establish_handshake() == True

def test_hardware_mac_address_spoofing():
    """
    Validation Gate: Ensures rogue IoT devices cannot sync to the master database.
    """
    with pytest.raises(PermissionError, match="Rogue Hardware Node Rejected"):
        ingest_edge_binary_payload("UNKNOWN-MAC-123", b"test_data")
        
    res = ingest_edge_binary_payload("SUH-EDGE-99A1", b"valid_binary_data")
    assert res["status"] == "SYNC_SUCCESS"

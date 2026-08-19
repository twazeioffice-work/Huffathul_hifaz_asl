import hmac
import hashlib
import json
import requests
import time

TARGET_URL = "http://localhost:8000/api/v1/webhooks/whatsapp"
META_APP_SECRET = "your-meta-app-secret-key-32bytes"

def run_simulation():
    print("=" * 80)
    print("     🛡️  SUFFAT-UL HUFFAZ ERP - OMNICHANNEL WEBHOOK SIMULATOR 🛡️")
    print("=" * 80)
    
    # 1. Structure Mock Parent Message Payload
    mock_payload = {
        "object": "whatsapp_business_account",
        "entry": [
            {
                "id": "META_WHATSAPP_ID_01",
                "changes": [
                    {
                        "value": {
                            "messaging_product": "whatsapp",
                            "metadata": {
                                "display_phone_number": "15555555555",
                                "phone_number_id": "123456789"
                            },
                            "contacts": [
                                {
                                    "profile": {
                                        "name": "Br. Tariq Mehmood"
                                    },
                                    "wa_id": "923001234567"
                                }
                            ],
                            "messages": [
                                {
                                    "from": "923001234567",
                                    "id": f"wamid.HBgLOTIzMDAxMjM0NTY3FQIAERgBM0I0OEE0NTZBMDg2N0RDOTM5AAAA",
                                    "timestamp": str(int(time.time())),
                                    "text": {
                                        "body": "Assalamoalaikum, Hamza had a fever yesterday and could not attend morning Sabaq."
                                    },
                                    "type": "text"
                                }
                            ]
                        },
                        "field": "messages"
                    }
                ]
            }
        ]
    }
    
    payload_bytes = json.dumps(mock_payload).encode("utf-8")
    
    # CASE A: Standard, Valid Webhook Influx
    valid_signature = hmac.new(
        key=META_APP_SECRET.encode("utf-8"),
        msg=payload_bytes,
        digestmod=hashlib.sha256
    ).hexdigest()
    
    headers_valid = {
        "Content-Type": "application/json",
        "X-Hub-Signature-256": f"sha256={valid_signature}"
    }
    
    print("\n[TEST 1] Sending Valid Webhook Event from Parent Br. Tariq Mehmood...")
    t0 = time.time()
    try:
        res1 = requests.post(TARGET_URL, data=payload_bytes, headers=headers_valid)
        t1 = time.time()
        
        print(f"  └─ Status Code: {res1.status_code}")
        print(f"  └─ Response: {res1.json()}")
        print(f"  └─ Fast-ACK Speed: {(t1 - t0)*1000:.2f}ms (Target: < 50ms)")
    except Exception as e:
        print(f"  └─ Failed to connect: {e}")
    
    # CASE B: Forged Webhook / Tampered Header Payload Injection Check
    headers_forged = {
        "Content-Type": "application/json",
        "X-Hub-Signature-256": "sha256=forged_and_invalid_hmac_hash_signature"
    }
    
    print("\n[TEST 2] Launching Forged Webhook Attack (Signature Forgery Verification)...")
    try:
        res2 = requests.post(TARGET_URL, data=payload_bytes, headers=headers_forged)
        print(f"  └─ Status Code: {res2.status_code} (Expected: 401 Unauthorized)")
        if res2.status_code == 401:
             print("  └─ [✓] BLOCK CONFIRMED. Spoofed payload dropped at perimeter gate.")
        else:
             print("  └─ [🚨 FAIL] Security leak identified! Tampered payload accepted!")
    except Exception as e:
        print(f"  └─ Failed to connect: {e}")
         
    # CASE C: Missing Header Boundary check
    print("\n[TEST 3] Sending webhook lacking signature context...")
    try:
        res3 = requests.post(TARGET_URL, data=payload_bytes)
        print(f"  └─ Status Code: {res3.status_code} (Expected: 401 Unauthorized)")
    except Exception as e:
        print(f"  └─ Failed to connect: {e}")

if __name__ == "__main__":
    run_simulation()

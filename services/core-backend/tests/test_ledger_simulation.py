#!/usr/bin/env python3
"""
================================================================================
SUFFAT-UL HUFFAZ - LEDGER INTEGRATION SIMULATION & INTEGRITY AUDIT TEST
================================================================================
File Ref: SUH-LEDGER-SIM-V1.0
Language: Python 3.12 (Standard Library + Mocked Sentry SDK)
Operational Target: Verify Double-Entry Cryptographic Chaining & Tamper Detection

This script simulates a live multi-tenant double-entry ledger. It generates a 
SHA-256 Merkle-linked transaction chain, performs unauthorized direct database 
tampering, executes the real-time background validation engine, detects the 
tampering event, and dispatches a detailed telemetry alert to the Sentry hub.
================================================================================
"""

import hashlib
import json
import uuid
import sys
from datetime import datetime, timezone

# Simulated Sentry Hub Mock for Tracking Telemetry Without Network Overhead
class MockSentry:
    def __init__(self):
        self.captured_events = []

    def init(self, dsn: str, environment: str):
        print(f"\033[94m[Sentry] Initializing Sentry SDK over DSN: {dsn[:25]}... [ENV: {environment}]\033[0m")

    def capture_exception(self, exception, extra=None):
        error_msg = str(exception)
        event_id = uuid.uuid4().hex
        event = {
            "event_id": event_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "error_class": exception.__class__.__name__,
            "message": error_msg,
            "extra_context": extra or {}
        }
        self.captured_events.append(event)
        print(f"\n\033[91m🚨 [Sentry Alert Captured] - Event ID: {event_id}")
        print(f"  └─ Error Class: {event['error_class']}")
        print(f"  └─ Message: {event['message']}")
        print(f"  └─ Tenant ID: {event['extra_context'].get('tenant_id')}")
        print(f"  └─ Affected Entry ID: {event['extra_context'].get('transaction_id')}")
        print(f"  └─ Recovery Action: {event['extra_context'].get('remediation')}\033[0m")
        return event_id

sentry_sdk = MockSentry()


class LedgerTransaction:
    """
    Represents a double-entry financial transaction secured with cryptographically
    chained SHA-256 blocks and mocked Ed25519 authorization signatures.
    """
    def __init__(self, tenant_id: str, branch_code: str, index: int, previous_hash: str, debits: list, credits: list, authorizer: str):
        self.tenant_id = tenant_id
        self.branch_code = branch_code
        self.index = index
        self.timestamp = datetime.now(timezone.utc).isoformat()
        self.transaction_id = f"TX-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        self.previous_hash = previous_hash
        self.debits = debits       # List of dicts: {"account": str, "amount": float}
        self.credits = credits     # List of dicts: {"account": str, "amount": float}
        self.authorizer = authorizer
        self.ed25519_signature = self._generate_mock_signature()
        self.hash = self.calculate_hash()

    def _generate_mock_signature(self) -> str:
        # Generates a mock Ed25519 digital signature representing cryptographic signing by the authorizer
        raw_sig_payload = f"{self.transaction_id}:{self.authorizer}:SECURE_KEY"
        return hashlib.sha256(raw_sig_payload.encode()).hexdigest()[:64]

    def calculate_hash(self) -> str:
        # Compiles all immutable transaction elements into a deterministic JSON string to calculate the block hash
        tx_dict = {
            "tenant_id": self.tenant_id,
            "branch_code": self.branch_code,
            "index": self.index,
            "timestamp": self.timestamp,
            "transaction_id": self.transaction_id,
            "previous_hash": self.previous_hash,
            "debits": sorted(self.debits, key=lambda x: x["account"]),
            "credits": sorted(self.credits, key=lambda x: x["account"]),
            "authorizer": self.authorizer,
            "ed25519_signature": self.ed25519_signature
        }
        serialized = json.dumps(tx_dict, sort_keys=True)
        return hashlib.sha256(serialized.encode()).hexdigest()


class DoubleEntryVault:
    """
    Represents the database vault holding the blockchain-like financial ledger
    and tracking multi-tenant separation bounds.
    """
    def __init__(self):
        self.chain = []
        sentry_sdk.init(
            dsn="https://6fcd20e5c83f1249b@sentry.railway.internal/4509121",
            environment="production-gcp-gke"
        )

    def append_transaction(self, tenant_id: str, branch_code: str, debits: list, credits: list, authorizer: str) -> LedgerTransaction:
        # 1. Enforce Double-Entry Mathematical Balance Constraint
        sum_debits = sum(d["amount"] for d in debits)
        sum_credits = sum(c["amount"] for c in credits)
        
        if abs(sum_debits - sum_credits) > 0.001:
            raise ValueError(
                f"Double-entry ledger line mismatch! Sum of Debits ({sum_debits}) must equal Sum of Credits ({sum_credits})."
            )

        # 2. Extract Chaining Context
        previous_hash = "0" * 64 if not self.chain else self.chain[-1].hash
        index = len(self.chain)

        # 3. Create, Sign, and Secure the Block Entry
        new_tx = LedgerTransaction(tenant_id, branch_code, index, previous_hash, debits, credits, authorizer)
        self.chain.append(new_tx)
        
        print(f"\033[92m✔ Posted Entry [{new_tx.transaction_id}] to Ledger Index {index}\033[0m")
        print(f"  ├─ Tenant ID: {tenant_id} | Branch: {branch_code}")
        print(f"  ├─ Debits : {debits}")
        print(f"  ├─ Credits: {credits}")
        print(f"  └─ Hash Signature: {new_tx.hash[:20]}...\n")
        return new_tx

    def validate_ledger_integrity(self) -> bool:
        """
        Traverses the multi-tenant cryptographic ledger chain, validating the
        structural balance and the mathematical proof of every previous block.
        """
        print("\033[95m\n[Audit Engine] Initializing cryptographic ledger integrity crawl...\033[0m")
        
        for i in range(len(self.chain)):
            current = self.chain[i]

            # Rule A: Enforce Double-Entry Balance
            sum_debits = sum(d["amount"] for d in current.debits)
            sum_credits = sum(c["amount"] for c in current.credits)
            if abs(sum_debits - sum_credits) > 0.001:
                error_msg = f"MALFORMED LEDGER LINE: Balanced transaction equilibrium broken at index {i}!"
                sentry_sdk.capture_exception(
                    ValueError(error_msg),
                    extra={
                        "tenant_id": current.tenant_id,
                        "transaction_id": current.transaction_id,
                        "debits": current.debits,
                        "credits": current.credits,
                        "remediation": "Lock active tenant sessions and trigger rollback to PITR snapshot"
                    }
                )
                return False

            # Rule B: Verify Block SHA-256 Hash
            if current.hash != current.calculate_hash():
                error_msg = f"DATABASE TAMPERING DETECTED: Computed hash does not match block signature at index {i}!"
                sentry_sdk.capture_exception(
                    ValueError(error_msg),
                    extra={
                        "tenant_id": current.tenant_id,
                        "transaction_id": current.transaction_id,
                        "expected_hash": current.hash,
                        "calculated_hash": current.calculate_hash(),
                        "remediation": "Block database write privileges immediately; trigger high-severity SRE incident response"
                    }
                )
                return False

            # Rule C: Verify Chaining Integrity
            if i > 0:
                prev = self.chain[i - 1]
                if current.previous_hash != prev.hash:
                    error_msg = f"CHAIN BROKEN: Chaining reference mismatch detected at index {i}!"
                    sentry_sdk.capture_exception(
                        ValueError(error_msg),
                        extra={
                            "tenant_id": current.tenant_id,
                            "transaction_id": current.transaction_id,
                            "stored_prev_hash": current.previous_hash,
                            "actual_prev_hash": prev.hash,
                            "remediation": "Isolate affected node from cluster and perform continuous WAL recovery validation"
                        }
                    )
                    return False

        print("\033[92m✔ Cryptographic chain verification complete! Ledger status: 100% SECURE & BALANCED.\033[0m")
        return True


def run_simulation():
    print("=" * 80)
    print("      SUFFAT-UL HUFFAZ: DOUBLE-ENTRY VAULT CRYPTOGRAPHIC INTEGRITY SIMULATION")
    print("=" * 80)

    # Initialize the ledger vault
    vault = DoubleEntryVault()

    # Tenant 1: Central Head Office posting transactions
    print("\n--- Phase A: Processing Valid Multi-Tenant Transactions ---")
    tx1 = vault.append_transaction(
        tenant_id="tenant-central-01",
        branch_code="BR-MUMBAI-01",
        debits=[{"account": "1010-CASH-BANK", "amount": 45000.0}],
        credits=[{"account": "4010-TUITION-FEES", "amount": 45000.0}],
        authorizer="cfo_arshad_khan"
    )

    # Tenant 2: Secondary School Branch posting transactions
    tx2 = vault.append_transaction(
        tenant_id="tenant-kerala-02",
        branch_code="BR-KERALA-03",
        debits=[{"account": "1010-CASH-BANK", "amount": 12500.0}],
        credits=[{"account": "4020-ADMISSION-FEES", "amount": 12500.0}],
        authorizer="principal_bilal_siddiqui"
    )

    # Run initial audit check
    initial_audit = vault.validate_ledger_integrity()
    assert initial_audit is True, "Sanity check failed: Fresh ledger should pass audit checks."

    # Simulate Malicious Direct Database Mutation Attempt on Tenant 1
    print("\n" + "!" * 80)
    print("⚠️ SIMULATING AN ADVERSARIAL DIRECT DATABASE ALTERATION ATTEMPT ON TENANT 1")
    print("!" * 80)
    print(f"\n[ATTACK] Hacker bypasses UI, accesses PostgreSQL backend on GCP directly,")
    print(f"         and attempts to adjust the payment record of entry [{tx1.transaction_id}]")
    print(f"         from ₹45,000.00 down to ₹5,000.00 to falsify audit logs...")

    # Force alter the internal value directly inside memory without running recalculate_hash()
    tx1.debits[0]["amount"] = 5000.0  # Tampering debit amount
    print(f"\n\033[93m[Database State] Modified Entry [{tx1.transaction_id}] directly:")
    print(f"  └─ Modified Debits: {tx1.debits}\033[0m")

    # Run real-time background validation engine (simulating cron or trigger run)
    tampered_audit = vault.validate_ledger_integrity()

    print("\n" + "=" * 80)
    if not tampered_audit:
        print("\033[92m✔ SUCCESS: The Cryptographic Vault successfully detected database alterations!")
        print("  System successfully blocked operations and alerted the SRE Security hub.\033[0m")
    else:
        print("\033[91m❌ FAILURE: Tampering went undetected! Secure the ledger schemas immediately.\033[0m")
    print("=" * 80)
    return not tampered_audit


# ================================================================================
# ACTIVE SIMULATION RUNTIME RUN
# ================================================================================
if __name__ == "__main__":
    success = run_simulation()
    sys.exit(0 if success else 1)

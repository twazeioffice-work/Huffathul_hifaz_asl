"use client";

import { useState, useCallback } from "react";

export interface LedgerLine {
  id: string;
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
  description: string;
}

export interface CryptographicLedgerTransaction {
  id: string;
  entry_number: string;
  timestamp: string;
  ledger_hash: string;
  signature: string;
  authorized_by: string;
  narration: string;
  source_channel: string;
  lines: LedgerLine[];
}

export function useLedgerInspector() {
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState<CryptographicLedgerTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inspectTransaction = useCallback(async (txId: string) => {
    setSelectedTxId(txId);
    setIsDrawerOpen(true);
    setIsLoading(true);
    setError(null);

    try {
      // Simulated API fetch from the Phase 6 secure ledger gateway
      const response = await mockFetchTransactionDetails(txId);
      setActiveTransaction(response);
    } catch (err: any) {
      setError(err.message || "Failed to load transaction audit trail.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const closeInspector = useCallback(() => {
    setIsDrawerOpen(false);
    setSelectedTxId(null);
    setActiveTransaction(null);
  }, []);

  return {
    inspectTransaction,
    closeInspector,
    isDrawerOpen,
    activeTransaction,
    isLoading,
    error,
    selectedTxId,
  };
}

// Mock API database fetch resolver ensuring zero external dependencies during runtime staging
async function mockFetchTransactionDetails(txId: string): Promise<CryptographicLedgerTransaction> {
  await new Promise((resolve) => setTimeout(resolve, 350)); // Fast UI feedback loop

  const mockDatabase: Record<string, CryptographicLedgerTransaction> = {
    "tx_94821034": {
      id: "tx_94821034",
      entry_number: "JE-2026-0819-001",
      timestamp: "2026-08-19 09:15:32 UTC",
      ledger_hash: "8f7e2a4b9c1d0e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f",
      signature: "MEQCIDz/bW0rRExK1uXgGg2eLqFpB4U8Xb9sD9TzWzL5F9N8AiAt9ZgQ7vK8x4mY3rT2pWqNs",
      authorized_by: "SRE-01 (Principal Cashier / Financial Trustee - Hyderabad)",
      narration: "Tuition Fees Collection - Hifz Division (Student ID: SUH-2026-0421)",
      source_channel: "Razorpay Cloud Integration (GCP Edge Webhook)",
      lines: [
        { id: "line_1", account_code: "10100", account_name: "Cash at Bank (Hifz Revenue Account - HDFC)", debit: 28500.00, credit: 0.00, description: "Direct credit of Hifz Semester Tuition Fee" },
        { id: "line_2", account_code: "40100", account_name: "Student Tuition Revenue (Unrestricted)", debit: 0.00, credit: 28500.00, description: "Fee earnings recognition" }
      ]
    },
    "tx_94821035": {
      id: "tx_94821035",
      entry_number: "JE-2026-0819-002",
      timestamp: "2026-08-19 10:30:15 UTC",
      ledger_hash: "2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d",
      signature: "MEQCID1vGx2sR9W4mD7eL3zB9K8qW5t1uY2zC3v4w5x6y7z8AiA9x8y7z6w5v4u3t2s1r0q9p",
      authorized_by: "SRE-02 (Branch Fleet Operations Director - Bengaluru)",
      narration: "Teacher Honorarium & Faculty Disbursement - August 2026 (Halqa Teachers)",
      source_channel: "NEFT Automated Bank Batch (State Bank of India)",
      lines: [
        { id: "line_3", account_code: "50100", account_name: "Faculty Honorarium & Payroll Expense", debit: 65000.00, credit: 0.00, description: "Monthly stipend for 6 Hifz Ustadhs" },
        { id: "line_4", account_code: "10100", account_name: "Operational Payroll Account (SBI)", debit: 0.00, credit: 65000.00, description: "Direct bank transfer to faculty accounts" }
      ]
    },
    "tx_94821036": {
      id: "tx_94821036",
      entry_number: "JE-2026-0819-003",
      timestamp: "2026-08-19 12:00:00 UTC",
      ledger_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      signature: "MEQCIH3zKq4v9R2mX8t7y1p5w9k3z7v1u8q4w2p9s5x1AiAh9t8r7q6p5o4n3m2l1k0j9i8h",
      authorized_by: "System Automated Cron Job (Facility Operations - Mumbai)",
      narration: "Campus Solar Grid Maintenance & Battery Cell Inverter Replacement",
      source_channel: "Internal Ledger Engine Daemon",
      lines: [
        { id: "line_5", account_code: "50300", account_name: "Campus Facility Maintenance Expense", debit: 36000.00, credit: 0.00, description: "Quarterly solar inverter servicing and battery balancing" },
        { id: "line_6", account_code: "10200", account_name: "Facility Operations Reserve Account", debit: 0.00, credit: 36000.00, description: "Vendor invoice settlement (Tata Power Solar)" }
      ]
    }
  };

  if (mockDatabase[txId]) {
    return mockDatabase[txId];
  }

  // Fallback default dynamic mock values
  return {
    id: txId,
    entry_number: `JE-2026-0819-${txId.slice(-3)}`,
    timestamp: "2026-08-19 12:00:00 UTC",
    ledger_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    signature: "MEQCIH3zKq4v9R2mX8t7y1p5w9k3z7v1u8q4w2p9s5x1AiAh9t8r7q6p5o4n3m2l1k0j9i8h",
    authorized_by: "System Automated Cron Job (Recurring Subscriptions)",
    narration: "Automated Depreciation Ledger Sync - Indian Asset ID: AST-9921",
    source_channel: "Internal Ledger Engine Daemon",
    lines: [
      { id: "l_1", account_code: "50200", account_name: "Asset Depreciation Expense", debit: 4200.00, credit: 0.00, description: "Monthly straight-line depreciation allocation" },
      { id: "l_2", account_code: "12199", account_name: "Accumulated Depreciation - Fleet Equipment", debit: 0.00, credit: 4200.00, description: "Contra-asset balance adjustment" }
    ]
  };
}

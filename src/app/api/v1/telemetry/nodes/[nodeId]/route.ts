import { NextRequest, NextResponse } from "next/server";

const NODE_TELEMETRY_DATA: Record<string, any> = {
  "EDGENODE-KL-04": {
    nodeId: "EDGENODE-KL-04",
    branchName: "Kerala Central Campus (Kozhikode)",
    status: "ONLINE",
    hardware: {
      cpuUsage: 14.2,
      ramUsage: 38.5,
      temp: 42.8,
      diskAvailable: "74.1 GB / 128 GB",
    },
    network: {
      latencyMs: 12,
      packetLoss: 0.0,
      tunnelState: "CONNECTED",
      connectionType: "SATELLITE",
    },
    syncMetrics: {
      pendingQueueSize: 0,
      lastSyncedTxId: "TX-20260819-5B4998-KL-HASH",
      lastSyncTimestamp: "2026-08-19 12:25:10 UTC",
      totalProtobufDeltasProcessed: 14820,
    },
  },
  "EDGENODE-UP-09": {
    nodeId: "EDGENODE-UP-09",
    branchName: "Lucknow Rural Branch (Uttar Pradesh)",
    status: "SYNCING",
    hardware: {
      cpuUsage: 64.8,
      ramUsage: 72.1,
      temp: 51.3,
      diskAvailable: "31.4 GB / 64 GB",
    },
    network: {
      latencyMs: 48,
      packetLoss: 1.2,
      tunnelState: "CONNECTED",
      connectionType: "CELLULAR",
    },
    syncMetrics: {
      pendingQueueSize: 42,
      lastSyncedTxId: "TX-20260819-8F7E2A-UP-HASH",
      lastSyncTimestamp: "2026-08-19 12:20:44 UTC",
      totalProtobufDeltasProcessed: 9240,
    },
  },
  "EDGENODE-KA-12": {
    nodeId: "EDGENODE-KA-12",
    branchName: "Bengaluru Main Campus (Jayanagar)",
    status: "ONLINE",
    hardware: {
      cpuUsage: 8.5,
      ramUsage: 29.0,
      temp: 39.4,
      diskAvailable: "92.0 GB / 256 GB",
    },
    network: {
      latencyMs: 4,
      packetLoss: 0.0,
      tunnelState: "CONNECTED",
      connectionType: "BROADBAND",
    },
    syncMetrics: {
      pendingQueueSize: 0,
      lastSyncedTxId: "TX-20260819-2C3D4E-KA-HASH",
      lastSyncTimestamp: "2026-08-19 12:26:01 UTC",
      totalProtobufDeltasProcessed: 31400,
    },
  },
  "EDGENODE-JK-01": {
    nodeId: "EDGENODE-JK-01",
    branchName: "Srinagar Edge Facility (Jammu & Kashmir)",
    status: "DEGRADED",
    hardware: {
      cpuUsage: 88.0,
      ramUsage: 84.6,
      temp: 58.2,
      diskAvailable: "12.8 GB / 64 GB",
    },
    network: {
      latencyMs: 145,
      packetLoss: 8.4,
      tunnelState: "RECONNECTING",
      connectionType: "SATELLITE",
    },
    syncMetrics: {
      pendingQueueSize: 119,
      lastSyncedTxId: "TX-20260819-E3B0C4-JK-HASH",
      lastSyncTimestamp: "2026-08-19 11:45:18 UTC",
      totalProtobufDeltasProcessed: 6180,
    },
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { nodeId: string } }
) {
  const nodeId = params.nodeId;
  const node = NODE_TELEMETRY_DATA[nodeId];

  if (!node) {
    // Dynamic fallback for any unlisted node
    return NextResponse.json({
      nodeId,
      branchName: `${nodeId} Regional Hub`,
      status: "ONLINE",
      hardware: { cpuUsage: 20.0, ramUsage: 45.0, temp: 42.0, diskAvailable: "64 GB / 128 GB" },
      network: { latencyMs: 18, packetLoss: 0.0, tunnelState: "CONNECTED", connectionType: "BROADBAND" },
      syncMetrics: { pendingQueueSize: 0, lastSyncedTxId: "TX-GENERIC-HASH", lastSyncTimestamp: "Just now", totalProtobufDeltasProcessed: 2500 },
    });
  }

  return NextResponse.json(node);
}

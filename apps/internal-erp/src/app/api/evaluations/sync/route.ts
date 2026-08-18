import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/db/prismaClient';

interface OfflineSyncPayload {
  evaluations: Array<{
    offlineId: string;
    studentId: string;
    date: string;
    sabq?: string;
    sabqi?: string;
    manzil?: string;
    rating: number;
    notes?: string;
  }>;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user via Dual-Header Injection proxy
    const authHeader = req.headers.get('authorization');
    const tenantHost = req.headers.get('x-tenant-host');

    if (!authHeader || !tenantHost) {
      return NextResponse.json({ error: 'Unauthorized or missing tenant context' }, { status: 401 });
    }

    // Normally we would verify the JWT here. For now, we simulate extraction.
    const evaluatorId = "simulate-uuid-from-jwt";

    const payload: OfflineSyncPayload = await req.json();

    if (!payload.evaluations || !Array.isArray(payload.evaluations)) {
      return NextResponse.json({ error: 'Invalid payload format' }, { status: 400 });
    }

    // 2. Perform a massive bulk upsert/insert in a database transaction
    const syncResults = await prisma.$transaction(
      payload.evaluations.map((evaluation) => {
        return prisma.dailyEvaluation.create({
          data: {
            // For offline sync, we might need to enforce uniqueness of an offline transaction ID
            // but for simplicity we'll insert a new record for each valid item.
            studentId: evaluation.studentId,
            evaluatorId: evaluatorId,
            date: new Date(evaluation.date),
            sabq: evaluation.sabq,
            sabqi: evaluation.sabqi,
            manzil: evaluation.manzil,
            rating: evaluation.rating,
            notes: evaluation.notes,
            synced: true, // Marked as true since it reached the server
          },
        });
      })
    );

    // 3. Return the processed keys so the mobile device can clear its pendingQueue
    return NextResponse.json({
      success: true,
      syncedCount: syncResults.length,
      processedIds: payload.evaluations.map(e => e.offlineId)
    }, { status: 200 });

  } catch (error) {
    console.error('[SYNC_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error during sync process.' }, { status: 500 });
  }
}

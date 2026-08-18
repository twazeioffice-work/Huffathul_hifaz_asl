import { prisma } from '@/db/prismaClient';
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { redirect } from 'next/navigation';

export default async function EvaluationsPage({
  params
}: {
  params: { institutionCode: string; branchCode: string }
}) {
  // Identify the branch through the path code
  const branch = await prisma.branch.findFirst({
    where: {
      code: params.branchCode,
      institution: {
        code: params.institutionCode
      }
    }
  });

  if (!branch) {
    redirect('/404');
  }

  // Fetch Evaluations sorted by most recent
  const evaluations = await prisma.dailyEvaluation.findMany({
    where: {
      student: {
        enrollments: {
          some: {
            class: {
              branchId: branch.id
            }
          }
        }
      }
    },
    include: {
      student: {
        include: {
          user: true
        }
      }
    },
    orderBy: {
      date: 'desc'
    },
    take: 50
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-primary-400">
        Live Hifz Evaluations (Synced)
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {evaluations.map((evalRecord) => (
          <Card key={evalRecord.id} className="bg-background/60 border border-slate-800">
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-md font-bold text-white">
                  {evalRecord.student.user.firstName} {evalRecord.student.user.lastName}
                </p>
                <p className="text-small text-default-500">
                  Juz: {evalRecord.student.currentJuz} | {new Date(evalRecord.date).toLocaleDateString()}
                </p>
              </div>
            </CardHeader>
            <Divider className="bg-slate-800" />
            <CardBody>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Sabq:</span>
                  <span className="text-cyan-400 font-mono">{evalRecord.sabq || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Sabqi:</span>
                  <span className="text-emerald-400 font-mono">{evalRecord.sabqi || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Manzil:</span>
                  <span className="text-amber-400 font-mono">{evalRecord.manzil || 'N/A'}</span>
                </div>
                <Divider className="my-2 bg-slate-800" />
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Rating:</span>
                  <span className="font-bold text-white">{evalRecord.rating}/5</span>
                </div>
                {evalRecord.notes && (
                  <p className="text-sm text-slate-500 italic mt-2">"{evalRecord.notes}"</p>
                )}
                {evalRecord.synced && (
                  <div className="mt-2 text-xs text-emerald-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Offline Synced
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        ))}

        {evaluations.length === 0 && (
          <p className="text-slate-500">No recent evaluations synced to this branch yet.</p>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { Card, CardHeader, CardBody, Divider } from '@heroui/react';
import Link from 'next/link';

export default async function BillingDashboardPage({
  params
}: {
  params: { institutionCode: string; branchCode: string }
}) {
  const { institutionCode, branchCode } = await params;
  
  return (
    <div className="p-8 w-full">
      <h1 className="text-2xl font-bold text-white mb-6">Financial Billing & Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-[#111827] border border-[#1F2937]">
          <CardBody>
            <p className="text-sm text-gray-400">Total Dues Pending</p>
            <p className="text-3xl font-bold text-[#00F0FF] mt-2">Rs 145,000</p>
          </CardBody>
        </Card>
        
        <Card className="bg-[#111827] border border-[#1F2937]">
          <CardBody>
            <p className="text-sm text-gray-400">Collected Fees (MTD)</p>
            <p className="text-3xl font-bold text-[#00F0FF] mt-2">Rs 852,500</p>
          </CardBody>
        </Card>

        <Card className="bg-[#111827] border border-[#1F2937]">
          <CardBody>
            <p className="text-sm text-gray-400">Ledger Assets (Cash/Bank)</p>
            <p className="text-3xl font-bold text-[#00F0FF] mt-2">Rs 2,150,000</p>
          </CardBody>
        </Card>

        <Card className="bg-[#111827] border border-[#1F2937]">
          <CardBody>
            <p className="text-sm text-gray-400">Unreconciled Receipts</p>
            <p className="text-3xl font-bold text-[#00F0FF] mt-2">14</p>
          </CardBody>
        </Card>
      </div>
      
      <Divider className="my-8 bg-[#1F2937]" />
      
      <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
      <div className="flex space-x-4">
        <Link href={`/app/${institutionCode}/${branchCode}/erp/billing/collect`} className="px-4 py-2 bg-[#00F0FF] text-black font-semibold rounded-md hover:bg-cyan-400 transition-colors">
          Collect Fee Payment
        </Link>
        <Link href={`/app/${institutionCode}/${branchCode}/erp/billing/due-schedule`} className="px-4 py-2 border border-[#00F0FF] text-[#00F0FF] font-semibold rounded-md hover:bg-[#00F0FF]/10 transition-colors">
          View Student Due Schedules
        </Link>
        <Link href={`/app/${institutionCode}/${branchCode}/erp/ledger`} className="px-4 py-2 border border-gray-600 text-gray-300 font-semibold rounded-md hover:bg-gray-800 transition-colors">
          View General Ledger
        </Link>
      </div>

      <div className="mt-12 bg-[#111827] border border-[#1F2937] p-6 rounded-lg h-64 flex items-center justify-center">
         <p className="text-gray-500 italic">Dynamic SVG Cash Inflow/Outflow Chart will be injected here</p>
      </div>
    </div>
  );
}

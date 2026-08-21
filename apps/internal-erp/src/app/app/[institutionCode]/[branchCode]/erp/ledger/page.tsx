"use client";
import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, Tabs, Tab } from '@heroui/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function LedgerPage({
  params
}: {
  params: { institutionCode: string; branchCode: string }
}) {
  const { institutionCode, branchCode } = useParams() as { institutionCode: string; branchCode: string };

  return (
    <div className="p-8 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">General Ledger</h1>
        <Link href={`/app/${institutionCode}/${branchCode}/erp/ledger/create-voucher`} className="px-4 py-2 bg-[#00F0FF] text-black font-semibold rounded-md hover:bg-cyan-400 transition-colors">
          Create Journal Voucher
        </Link>
      </div>

      <div className="bg-[#111827] border border-[#1F2937] p-4 rounded-md mb-6 flex gap-4">
        <Input placeholder="Search vouchers..." className="w-64" />
        <Input type="date" className="w-48" />
        <Button variant="flat" color="primary" className="bg-[#1F2937] text-white">Export CSV</Button>
      </div>

      <Tabs aria-label="Ledger Tabs" color="primary" variant="underlined">
        <Tab key="vouchers" title="Journal Vouchers">
          <div className="bg-[#111827] border border-[#1F2937] rounded-md overflow-hidden mt-4">
            <Table aria-label="Vouchers Table">
              <TableHeader>
                <TableColumn>VOUCHER NO</TableColumn>
                <TableColumn>DATE</TableColumn>
                <TableColumn>TYPE</TableColumn>
                <TableColumn>NARRATION</TableColumn>
                <TableColumn>AMOUNT</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow key="1">
                  <TableCell className="text-[#00F0FF] font-mono">REC-A1B2C3D4</TableCell>
                  <TableCell className="text-gray-400">2026-08-18</TableCell>
                  <TableCell><span className="px-2 py-1 bg-green-900/50 text-green-400 rounded-full text-xs">Receipt</span></TableCell>
                  <TableCell className="text-white">Fee collection. Student ID: 1042</TableCell>
                  <TableCell className="text-white font-mono">Rs 5,000.00</TableCell>
                </TableRow>
                <TableRow key="2">
                  <TableCell className="text-[#00F0FF] font-mono">JV-2026-0042</TableCell>
                  <TableCell className="text-gray-400">2026-08-17</TableCell>
                  <TableCell><span className="px-2 py-1 bg-purple-900/50 text-purple-400 rounded-full text-xs">Journal</span></TableCell>
                  <TableCell className="text-white">Monthly utility expense accrued</TableCell>
                  <TableCell className="text-white font-mono">Rs 12,500.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Tab>
        <Tab key="coa" title="Chart of Accounts">
          <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-md mt-4 text-gray-300 font-mono text-sm">
            <div className="pl-4 border-l border-gray-700 pb-2">
              <span className="text-[#00F0FF] font-bold">100000 - Assets</span>
              <div className="pl-8 pt-2">101000 - Cash in Hand</div>
              <div className="pl-8 pt-2">102000 - Bank Al Habib Account</div>
            </div>
            <div className="pl-4 border-l border-gray-700 py-2">
              <span className="text-[#00F0FF] font-bold">200000 - Liabilities</span>
            </div>
            <div className="pl-4 border-l border-gray-700 py-2">
              <span className="text-[#00F0FF] font-bold">400000 - Revenue</span>
              <div className="pl-8 pt-2">401000 - Tuition Fees Income</div>
              <div className="pl-8 pt-2">402000 - Admission Fees Income</div>
            </div>
            <div className="pl-4 border-l border-gray-700 py-2">
              <span className="text-[#00F0FF] font-bold">500000 - Expenses</span>
              <div className="pl-8 pt-2">501000 - Teacher Salaries</div>
              <div className="pl-8 pt-2">502000 - Utilities</div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}




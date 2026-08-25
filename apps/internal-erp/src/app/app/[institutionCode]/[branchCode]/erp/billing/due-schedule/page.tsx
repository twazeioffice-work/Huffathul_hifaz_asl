"use client";
import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button } from '@heroui/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function Page() {
  const { institutionCode, branchCode } = useParams() as { institutionCode: string; branchCode: string };

  // Mock data for the static UI
  const schedules = [
    { id: "1", student: "Ahmed Raza", grade: "Hifz Year 2", dueAmount: "Rs 5,000", paidAmount: "Rs 2,000", dueDate: "2026-08-30", status: "Partial" },
    { id: "2", student: "Omar Farooq", grade: "Nazra Year 1", dueAmount: "Rs 3,000", paidAmount: "Rs 3,000", dueDate: "2026-08-15", status: "Paid" },
    { id: "3", student: "Zaid Ali", grade: "Hifz Year 3", dueAmount: "Rs 5,500", paidAmount: "Rs 0", dueDate: "2026-08-30", status: "Pending" }
  ];

  return (
    <div className="p-8 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black font-semibold">Student Due Schedules</h1>
        <Link href={`/app/${institutionCode}/${branchCode}/erp/billing/collect`} className="px-4 py-2 bg-[#00F0FF] text-black font-semibold rounded-md hover:bg-cyan-400 transition-colors">
          Collect Payment
        </Link>
      </div>

      <div className="bg-[#111827] border border-[#1F2937] p-4 rounded-md mb-6 flex gap-4">
        <Input placeholder="Search student name..." className="w-64" />
        <Button variant="flat" color="primary" className="bg-[#1F2937] text-black font-semibold">Filter by Batch</Button>
        <Button variant="flat" color="primary" className="bg-[#1F2937] text-black font-semibold">Status: Pending</Button>
      </div>

      <div className="bg-[#111827] border border-[#1F2937] rounded-md overflow-hidden">
        <Table aria-label="Student Due Schedules Table" className="w-full">
          <TableHeader>
            <TableColumn>STUDENT</TableColumn>
            <TableColumn>PROGRAM / BATCH</TableColumn>
            <TableColumn>DUE AMOUNT</TableColumn>
            <TableColumn>PAID AMOUNT</TableColumn>
            <TableColumn>DUE DATE</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell className="text-black font-semibold">{schedule.student}</TableCell>
                <TableCell className="text-slate-700 font-medium">{schedule.grade}</TableCell>
                <TableCell className="text-black font-semibold">{schedule.dueAmount}</TableCell>
                <TableCell className="text-black font-semibold">{schedule.paidAmount}</TableCell>
                <TableCell className="text-slate-700 font-medium">{schedule.dueDate}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    schedule.status === 'Paid' ? 'bg-green-900/50 text-green-400' :
                    schedule.status === 'Partial' ? 'bg-yellow-900/50 text-yellow-400' :
                    'bg-red-900/50 text-red-400'
                  }`}>
                    {schedule.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Link href={`/app/${institutionCode}/${branchCode}/erp/billing/collect?due_id=${schedule.id}`} className="text-[#00F0FF] hover:underline text-sm font-medium">
                    Collect
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}




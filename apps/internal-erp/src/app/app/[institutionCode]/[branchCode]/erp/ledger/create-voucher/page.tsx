"use client";

import React, { useState } from 'react';
import { Card, CardBody, Input, Button, Divider, Textarea } from '@heroui/react';
import { useParams, useRouter } from 'next/navigation';

export default function CreateVoucherPage() {
  const router = useRouter();
  const params = useParams();

  const [narration, setNarration] = useState('');
  const [lines, setLines] = useState([
    { id: 1, account: '', debit: '', credit: '' },
    { id: 2, account: '', debit: '', credit: '' },
  ]);

  const addLine = () => {
    setLines([...lines, { id: Date.now(), account: '', debit: '', credit: '' }]);
  };

  const removeLine = (id: number) => {
    if (lines.length > 2) {
      setLines(lines.filter(l => l.id !== id));
    }
  };

  const updateLine = (id: number, field: string, value: string) => {
    setLines(lines.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const totalDebit = lines.reduce((acc, curr) => acc + (parseFloat(curr.debit) || 0), 0);
  const totalCredit = lines.reduce((acc, curr) => acc + (parseFloat(curr.credit) || 0), 0);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  const handleSubmit = () => {
    if (!isBalanced) return;
    alert("Voucher submitted to ledger engine successfully.");
    router.push(`/app/${params.institutionCode}/${params.branchCode}/erp/ledger`);
  };

  return (
    <div className="p-8 w-full max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-black font-semibold mb-6">Create Journal Voucher</h1>
      
      <Card className="bg-[#111827] border border-[#1F2937]">
        <CardBody className="p-6">
          <Textarea
            label="Voucher Narration"
            placeholder="E.g., Monthly electricity bill accrual"
            value={narration}
            onChange={(e) => setNarration(e.target.value)}
            className="mb-8"
          />

          <div className="bg-[#1F2937] p-4 rounded-md mb-4 flex">
            <div className="w-1/2 font-semibold text-slate-800 font-medium">Account Head</div>
            <div className="w-1/4 font-semibold text-slate-800 font-medium text-right pr-4">Debit (Rs)</div>
            <div className="w-1/4 font-semibold text-slate-800 font-medium text-right pr-4">Credit (Rs)</div>
            <div className="w-10"></div>
          </div>

          {lines.map((line) => (
            <div key={line.id} className="flex gap-4 mb-4 items-center">
              <div className="w-1/2">
                <Input
                  placeholder="Account Code or Name"
                  value={line.account}
                  onChange={(e) => updateLine(line.id, 'account', e.target.value)}
                />
              </div>
              <div className="w-1/4">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={line.debit}
                  onChange={(e) => updateLine(line.id, 'debit', e.target.value)}
                  disabled={!!line.credit && line.credit !== '0'}
                />
              </div>
              <div className="w-1/4">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={line.credit}
                  onChange={(e) => updateLine(line.id, 'credit', e.target.value)}
                  disabled={!!line.debit && line.debit !== '0'}
                />
              </div>
              <div className="w-10 flex justify-end">
                <Button isIconOnly color="danger" variant="light" onPress={() => removeLine(line.id)} disabled={lines.length <= 2}>
                  ×
                </Button>
              </div>
            </div>
          ))}

          <Button variant="light" color="primary" onPress={addLine} className="mt-2 text-[#00F0FF]">
            + Add Line
          </Button>

          <Divider className="my-6 bg-[#1F2937]" />

          <div className="flex justify-end items-center gap-8 mb-8">
            <div className="text-right">
              <p className="text-sm text-slate-700 font-medium">Total Debit</p>
              <p className="text-xl font-mono text-black font-semibold">Rs {totalDebit.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-700 font-medium">Total Credit</p>
              <p className={`text-xl font-mono ${isBalanced ? 'text-black font-semibold' : 'text-red-500'}`}>Rs {totalCredit.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="light" color="danger" onPress={() => router.back()}>Cancel</Button>
            <Button 
              className={`font-semibold ${isBalanced ? 'bg-[#00F0FF] text-black' : 'bg-gray-600 text-slate-700 font-medium cursor-not-allowed'}`}
              disabled={!isBalanced}
              onPress={handleSubmit}
            >
              Post Voucher
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}


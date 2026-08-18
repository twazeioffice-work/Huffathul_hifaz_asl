"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardBody, Input, Button, Select, SelectItem, Divider } from '@heroui/react';
import { useParams, useRouter } from 'next/navigation';

const feeCollectionSchema = z.object({
  student_id: z.string().min(1, 'Student ID is required'),
  due_schedule_id: z.string().min(1, 'Due Schedule ID is required'),
  amount_paid: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number"
  }),
  payment_method: z.enum(['Cash', 'UPI', 'Bank_Transfer']),
});

type FeeCollectionForm = z.infer<typeof feeCollectionSchema>;

export default function CollectFeePage() {
  const router = useRouter();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptId, setReceiptId] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FeeCollectionForm>({
    resolver: zodResolver(feeCollectionSchema),
    defaultValues: {
      payment_method: 'Cash'
    }
  });

  const onSubmit = async (data: FeeCollectionForm) => {
    setIsSubmitting(true);
    // Simulate FastAPI POST /api/v1/billing/collect
    setTimeout(() => {
      setIsSubmitting(false);
      setReceiptId(`REC-${Math.random().toString(36).substring(7).toUpperCase()}`);
    }, 1500);
  };

  if (receiptId) {
    return (
      <div className="p-8 w-full max-w-2xl mx-auto mt-10">
        <Card className="bg-[#111827] border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
          <CardBody className="text-center p-10">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Payment Collected</h2>
            <p className="text-gray-400 mb-6">The transaction was successfully posted to the ledger.</p>
            <div className="bg-[#1F2937] p-4 rounded-md mb-8">
              <p className="text-sm text-gray-400 uppercase tracking-wide">Receipt Reference</p>
              <p className="text-xl font-mono text-[#00F0FF] mt-1">{receiptId}</p>
            </div>
            <div className="flex justify-center space-x-4">
              <Button color="primary" variant="bordered" className="border-[#00F0FF] text-[#00F0FF]" onPress={() => window.print()}>
                Print PDF Receipt
              </Button>
              <Button color="primary" className="bg-[#00F0FF] text-black" onPress={() => router.push(`/app/${params.institutionCode}/${params.branchCode}/erp/billing`)}>
                Back to Dashboard
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 w-full max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Collect Fee Payment</h1>
      
      <Card className="bg-[#111827] border border-[#1F2937]">
        <CardBody className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Input
                  label="Student ID or Name"
                  placeholder="Enter ID or select student"
                  {...register('student_id')}
                  isInvalid={!!errors.student_id}
                  errorMessage={errors.student_id?.message}
                />
              </div>
              <div>
                <Input
                  label="Due Schedule Reference"
                  placeholder="Select pending due"
                  {...register('due_schedule_id')}
                  isInvalid={!!errors.due_schedule_id}
                  errorMessage={errors.due_schedule_id?.message}
                />
              </div>
            </div>

            <Divider className="bg-[#1F2937]" />

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Input
                  label="Amount to Collect (Rs)"
                  placeholder="0.00"
                  type="number"
                  {...register('amount_paid')}
                  isInvalid={!!errors.amount_paid}
                  errorMessage={errors.amount_paid?.message}
                  startContent={<div className="pointer-events-none flex items-center"><span className="text-default-400 text-small">Rs</span></div>}
                />
              </div>
              <div>
                <Select
                  label="Payment Method"
                  placeholder="Select a method"
                  defaultSelectedKeys={["Cash"]}
                  onChange={(e) => setValue('payment_method', e.target.value as any)}
                >
                  <SelectItem key="Cash" value="Cash">Cash</SelectItem>
                  <SelectItem key="UPI" value="UPI">UPI</SelectItem>
                  <SelectItem key="Bank_Transfer" value="Bank_Transfer">Bank Transfer</SelectItem>
                </Select>
                {errors.payment_method && <p className="text-red-500 text-xs mt-1">{errors.payment_method.message}</p>}
              </div>
            </div>

            <div className="pt-6 flex justify-end space-x-4">
              <Button type="button" variant="light" color="danger" onPress={() => router.back()}>Cancel</Button>
              <Button type="submit" isLoading={isSubmitting} className="bg-[#00F0FF] text-black font-semibold">
                Submit & Process Ledger
              </Button>
            </div>
            
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

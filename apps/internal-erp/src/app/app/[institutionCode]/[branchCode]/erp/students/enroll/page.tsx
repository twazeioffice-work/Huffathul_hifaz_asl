"use client";
import { CheckPermission } from "@/components/CheckPermission";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { use } from "react";

export default function AdmissionsWizard({
  params,
}: {
  params: Promise<{ institutionCode: string; branchCode: string }>;
}) {
  const { institutionCode, branchCode } = use(params);
  const basePath = `/app/${institutionCode}/${branchCode}/erp`;

  return (
    <CheckPermission 
      permission="admission.create" 
      institutionCode={institutionCode} 
      branchCode={branchCode}
      fallback={<div className="p-8 text-center text-destructive">Unauthorized: Missing admission.create permission</div>}
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href={`${basePath}/students`} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Admissions Wizard</h2>
            <p className="text-muted-foreground text-sm">
              Enroll a new student into the {branchCode.toUpperCase()} branch.
            </p>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-8">
          <form className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b border-border pb-2">1. Personal Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <input required className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-ring" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <input required className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-ring" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date of Birth</label>
                  <input type="date" required className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-ring" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gender</label>
                  <select required className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-ring text-muted-foreground">
                    <option value="">Select Gender...</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b border-border pb-2">2. Guardian & Contact Info</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Primary Guardian Name</label>
                  <input required className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-ring" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Phone (WhatsApp)</label>
                  <input required type="tel" placeholder="+1..." className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-ring" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium">Residential Address</label>
                  <textarea required className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-ring"></textarea>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b border-border pb-2">3. Academic Placement</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Program / Course</label>
                  <select required className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-ring text-muted-foreground">
                    <option value="">Select Program...</option>
                    <option value="hifz">Hifz Program</option>
                    <option value="aalim">Aalim Course</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Batch</label>
                  <select required className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-ring text-muted-foreground">
                    <option value="">Select Batch...</option>
                    <option value="2024">Batch 2024</option>
                    <option value="2025">Batch 2025</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-4">
              <Link href={`${basePath}/students`} className="text-sm text-muted-foreground hover:text-foreground">
                Cancel
              </Link>
              <button type="submit" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-ring gap-2 transition-colors">
                <Save className="h-4 w-4" />
                Complete Enrollment
              </button>
            </div>
          </form>
        </div>
      </div>
    </CheckPermission>
  );
}

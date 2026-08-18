// Location: apps/internal-erp/src/app/app/[institutionCode]/[branchCode]/erp/affiliations/request/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  institutionName: z.string().min(3, "Institution name is required"),
  code: z.string().min(2, "Code is required"),
  domain: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  reviewNotes: z.string().optional()
});

export default function RequestAffiliationPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      institutionName: "",
      code: "",
      domain: "",
      reviewNotes: ""
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    // POST /api/v1/affiliations logic here
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary tracking-tight">Request New Affiliation</h1>
        <p className="text-xs text-muted-foreground">Submit verifying documents and institutional details.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="glass-panel p-6 rounded-lg space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Institution Name</label>
          <input 
            {...form.register("institutionName")} 
            className="w-full bg-background border border-muted p-2 rounded"
          />
          {form.formState.errors.institutionName && (
            <p className="text-destructive text-xs mt-1">{form.formState.errors.institutionName.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Affiliation Code</label>
          <input 
            {...form.register("code")} 
            className="w-full bg-background border border-muted p-2 rounded"
          />
          {form.formState.errors.code && (
            <p className="text-destructive text-xs mt-1">{form.formState.errors.code.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Domain URL</label>
          <input 
            {...form.register("domain")} 
            className="w-full bg-background border border-muted p-2 rounded"
            placeholder="https://..."
          />
          {form.formState.errors.domain && (
            <p className="text-destructive text-xs mt-1">{form.formState.errors.domain.message}</p>
          )}
        </div>
        
        <button type="submit" className="bg-primary text-background px-4 py-2 rounded text-sm font-bold w-full mt-4">
          Submit Affiliation Request
        </button>
      </form>
    </div>
  );
}

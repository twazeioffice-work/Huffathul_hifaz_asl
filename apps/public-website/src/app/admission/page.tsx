"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, GraduationCap, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const admissionsSchema = z.object({
  branch_id: z.string().uuid("Please provide a valid Branch UUID."),
  academic_year_id: z.string().uuid("Please provide a valid Academic Year UUID."),
  batch_id: z.string().uuid("Please provide a valid Batch UUID."),
  full_name: z.string().min(3, "Full name must be at least 3 characters."),
  email: z.string().email("A valid email address is required."),
  phone_number: z
    .string()
    .regex(/^\+?\d{10,14}$/, "Enter a valid phone number with country code (e.g. +919876543210)"),
  guardian_name: z.string().min(3, "Guardian name is required."),
  guardian_relation: z.enum(["Father", "Mother", "Uncle", "Other"]),
});

type AdmissionsFormValues = z.infer<typeof admissionsSchema>;

export default function PublicAdmissionsWizard() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successReference, setSuccessReference] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    trigger,
  } = useForm<AdmissionsFormValues>({
    resolver: zodResolver(admissionsSchema),
    mode: "onChange",
    defaultValues: {
      branch_id: "123e4567-e89b-12d3-a456-426614174000",
      academic_year_id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      batch_id: "550e8400-e29b-41d4-a716-446655440000",
      guardian_relation: "Father",
    },
  });

  const nextStep = async () => {
    const fieldsToValidate =
      step === 1
        ? (["branch_id", "academic_year_id", "batch_id"] as const)
        : (["full_name", "email", "phone_number", "guardian_name"] as const);

    const isStepValid = await trigger(fieldsToValidate as any);
    if (isStepValid) setStep((prev) => prev + 1);
  };

  const onSubmit = async (data: AdmissionsFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admission-ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.status === 429) {
        setError("root", {
          message: "Submission rate limit exceeded. Please wait 60 seconds before retrying.",
        });
        return;
      }

      if (!response.ok) {
        const err = await response.json();
        setError("root", {
          message: err.error || "Enrollment submission failed. Please verify the details.",
        });
        return;
      }

      const resData = await response.json();
      setSuccessReference(resData.reference || "SUH-ADM-CONFIRMED");
      setStep(3);
    } catch (err) {
      setError("root", {
        message: "Network connectivity error. Ingestion service temporarily unreachable.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-xl px-4 py-12">
      <div className="bg-card border border-border rounded-lg p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-border pb-4">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-lg font-bold text-foreground">
              Online Admissions Portal
            </h2>
          </div>
          <span className="text-xs font-semibold text-muted-foreground bg-slate-100 px-2.5 py-1 rounded">
            Step {step} of 3
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {errors.root && (
            <div className="bg-destructive/10 border border-destructive text-destructive text-xs p-3 rounded">
              {errors.root.message}
            </div>
          )}

          {/* Step 1: Academic Year & Batch */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Academic Placement
                </h3>
              </div>

              <Input
                label="Branch Identifier (UUID)"
                {...register("branch_id")}
                error={errors.branch_id?.message}
              />

              <Input
                label="Academic Year Identifier (UUID)"
                {...register("academic_year_id")}
                error={errors.academic_year_id?.message}
              />

              <Input
                label="Enrollment Batch (UUID)"
                {...register("batch_id")}
                error={errors.batch_id?.message}
              />

              <Button
                type="button"
                onClick={nextStep}
                className="w-full mt-4 justify-center"
              >
                Proceed to Applicant Profile
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Step 2: Student & Guardian Profile */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Student Demographics
                </h3>
              </div>

              <Input
                label="Student Full Name"
                {...register("full_name")}
                error={errors.full_name?.message}
              />

              <Input
                label="Email Address"
                type="email"
                {...register("email")}
                error={errors.email?.message}
              />

              <Input
                label="WhatsApp Phone Number (E.164)"
                placeholder="+919876543210"
                {...register("phone_number")}
                error={errors.phone_number?.message}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Guardian Full Name"
                  {...register("guardian_name")}
                  error={errors.guardian_name?.message}
                />

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-foreground">
                    Relation
                  </label>
                  <select
                    {...register("guardian_relation")}
                    className="flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus-ring"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Uncle">Uncle</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="w-1/2 justify-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 justify-center"
                >
                  {isSubmitting ? "Submitting..." : "Submit Admission"}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Success Confirmation */}
          {step === 3 && (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground">
                Application Successfully Logged
              </h3>
              <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
                Your admission application has been registered in our central admissions
                ledger. Our admissions directorate will contact you via WhatsApp for document verification.
              </p>
              <div className="bg-slate-100 border border-dashed border-border py-2.5 px-4 rounded inline-block font-mono text-sm font-bold text-primary">
                {successReference}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

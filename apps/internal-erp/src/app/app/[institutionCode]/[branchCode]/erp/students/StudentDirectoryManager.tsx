"use client";

import { useState } from "react";
import { Tabs, Tab, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, User, Chip, Button, Progress, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Search, Plus, Filter, UserCheck, PhoneCall, GraduationCap } from "lucide-react";
import { CheckPermission } from "@/components/CheckPermission";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const admissionSchema = z.object({
  branch_id: z.string().min(1, "Branch is required"),
  batch_id: z.string().min(1, "Batch is required"),
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  dob: z.string().min(10, "Valid DOB required"),
  email: z.string().email("Invalid email").optional().or(z.literal('')),
  guardian_name: z.string().min(2, "Guardian name is required"),
  guardian_phone: z.string().min(10, "Phone must include country code for WhatsApp"),
});

type AdmissionFormValues = z.infer<typeof admissionSchema>;

export function StudentDirectoryManager({ institutionCode, branchCode }: { institutionCode: string, branchCode: string }) {
  const [selectedKey, setSelectedKey] = useState("roster");
  const [wizardStep, setWizardStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: AdmissionFormValues) => {
    setIsSubmitting(true);
    // Simulate API Call for distributed transaction
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSelectedKey("roster");
    setWizardStep(1);
  };

  return (
    <div className="flex w-full flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Student Administration</h2>
          <p className="text-muted-foreground text-sm">
            Manage directory roster and new admissions for {branchCode.toUpperCase()}.
          </p>
        </div>
      </div>

      <Tabs 
        selectedKey={selectedKey} 
        onSelectionChange={(key) => setSelectedKey(String(key))}
        color="primary"
        variant="bordered"
        classNames={{
          tabList: "bg-card border-border",
        }}
      >
        <Tab
          key="roster"
          title={
            <div className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4" />
              <span>Student Roster</span>
            </div>
          }
        >
          <div className="mt-4 bg-card/80 backdrop-blur-md border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Input
                classNames={{
                  base: "max-w-md",
                  inputWrapper: "border-border",
                }}
                placeholder="Search by name, ID, or phone..."
                startContent={<Search className="text-muted-foreground w-4 h-4" />}
                variant="bordered"
                isClearable
              />
              <Button variant="flat" startContent={<Filter className="w-4 h-4" />}>
                Filter
              </Button>
            </div>

            <Table 
              aria-label="Student Directory"
              selectionMode="multiple"
              classNames={{
                th: "bg-muted text-muted-foreground font-semibold border-b border-border",
                td: "border-b border-border/50 py-3",
              }}
            >
              <TableHeader>
                <TableColumn>STUDENT PROFILE</TableColumn>
                <TableColumn>ADMISSION #</TableColumn>
                <TableColumn>BATCH</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn align="end">ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <User
                        avatarProps={{radius: "sm", src: `https://i.pravatar.cc/150?u=${i}`}}
                        description={`guardian_${i}@example.com`}
                        name={`Student Name ${i}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs">ADM-{1000 + i}</TableCell>
                    <TableCell>Batch 2026</TableCell>
                    <TableCell>
                      <Chip size="sm" color="success" variant="flat">Active</Chip>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="light" color="primary">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Tab>

        <Tab
          key="admissions"
          title={
            <div className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Admissions Wizard</span>
            </div>
          }
        >
          <div className="mt-4 bg-card/80 backdrop-blur-md border border-border rounded-xl p-6 shadow-sm max-w-3xl mx-auto">
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-2">New Student Enrollment</h3>
              <Progress 
                aria-label="Wizard Progress"
                value={(wizardStep / 3) * 100} 
                className="max-w-md" 
                color="primary"
                size="sm"
              />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {wizardStep === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <div className="flex items-center gap-2 mb-4 text-primary">
                    <GraduationCap className="w-5 h-5" />
                    <h4 className="font-semibold">Step 1: Academic Mapping</h4>
                  </div>
                  <Autocomplete 
                    label="Assign Branch" 
                    variant="bordered"
                    defaultItems={[{label: branchCode.toUpperCase(), value: branchCode}]}
                    {...register("branch_id")}
                    errorMessage={errors.branch_id?.message}
                  >
                    {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                  </Autocomplete>
                  <Autocomplete 
                    label="Assign Batch" 
                    variant="bordered"
                    defaultItems={[{label: "Batch 2026 (Hifz)", value: "b2026"}]}
                    {...register("batch_id")}
                    errorMessage={errors.batch_id?.message}
                  >
                    {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                  </Autocomplete>
                  <div className="flex justify-end pt-4">
                    <Button color="primary" onPress={() => setWizardStep(2)}>Next Step</Button>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <div className="flex items-center gap-2 mb-4 text-primary">
                    <UserCheck className="w-5 h-5" />
                    <h4 className="font-semibold">Step 2: Student Demographics</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="First Name" variant="bordered" {...register("first_name")} errorMessage={errors.first_name?.message} />
                    <Input label="Last Name" variant="bordered" {...register("last_name")} errorMessage={errors.last_name?.message} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Date of Birth" type="date" variant="bordered" {...register("dob")} errorMessage={errors.dob?.message} />
                    <Input label="Email (Optional)" type="email" variant="bordered" {...register("email")} errorMessage={errors.email?.message} />
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button variant="flat" onPress={() => setWizardStep(1)}>Back</Button>
                    <Button color="primary" onPress={() => setWizardStep(3)}>Next Step</Button>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <div className="flex items-center gap-2 mb-4 text-primary">
                    <PhoneCall className="w-5 h-5" />
                    <h4 className="font-semibold">Step 3: Guardian Context</h4>
                  </div>
                  <Input 
                    label="Guardian Full Name" 
                    variant="bordered" 
                    {...register("guardian_name")} 
                    errorMessage={errors.guardian_name?.message} 
                  />
                  <Input 
                    label="WhatsApp Phone Number" 
                    placeholder="+1234567890"
                    variant="bordered" 
                    description="Include country code for automated WhatsApp sync alerts."
                    {...register("guardian_phone")} 
                    errorMessage={errors.guardian_phone?.message} 
                  />
                  <div className="flex justify-between pt-4">
                    <Button variant="flat" onPress={() => setWizardStep(2)}>Back</Button>
                    <CheckPermission permission="admission:enroll" institutionCode={institutionCode} branchCode={branchCode}>
                      <Button color="primary" type="submit" isLoading={isSubmitting} isDisabled={!isValid}>
                        Commit Enrollment
                      </Button>
                    </CheckPermission>
                  </div>
                </div>
              )}
            </form>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

import { AcademicManager } from "./AcademicManager";

export default async function AcademicDashboard({
  params,
}: {
  params: Promise<{ institutionCode: string; branchCode: string }>;
}) {
  const { institutionCode, branchCode } = await params;
  
  return (
    <AcademicManager 
      institutionCode={institutionCode} 
      branchCode={branchCode} 
    />
  );
}

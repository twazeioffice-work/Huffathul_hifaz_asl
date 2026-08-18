import { InstitutionDashboardClient } from "./InstitutionDashboardClient";

export default async function InstitutionDashboard({
  params,
}: {
  params: Promise<{ institutionCode: string; branchCode: string }>;
}) {
  const { institutionCode, branchCode } = await params;
  
  return <InstitutionDashboardClient institutionCode={institutionCode} branchCode={branchCode} />;
}

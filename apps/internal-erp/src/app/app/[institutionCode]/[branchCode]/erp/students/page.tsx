import { StudentDirectoryManager } from "./StudentDirectoryManager";

export default async function StudentRoster({
  params,
}: {
  params: Promise<{ institutionCode: string; branchCode: string }>;
}) {
  const { institutionCode, branchCode } = await params;
  
  return (
    <StudentDirectoryManager 
      institutionCode={institutionCode} 
      branchCode={branchCode} 
    />
  );
}

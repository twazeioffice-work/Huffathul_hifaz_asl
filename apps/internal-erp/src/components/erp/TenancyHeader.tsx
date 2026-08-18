export function TenancyHeader({
  institutionCode,
  branchCode,
}: {
  institutionCode: string;
  branchCode: string;
}) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold tracking-tight">
          {institutionCode.toUpperCase()} Workspace
        </h1>
        <p className="text-sm text-muted-foreground">
          Branch: {branchCode.toUpperCase()}
        </p>
      </div>
      <div className="flex items-center gap-4">
        {/* Placeholder for user profile / notifications */}
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
          A
        </div>
      </div>
    </div>
  );
}

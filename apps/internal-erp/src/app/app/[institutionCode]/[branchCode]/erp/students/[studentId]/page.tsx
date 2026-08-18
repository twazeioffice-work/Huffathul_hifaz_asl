export default async function StudentProfile({ params }: { params: Promise<{ studentId: string }> }) {
    const { studentId } = await params;
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <header className="pb-4 border-b border-border">
                <h1 className="text-3xl font-extrabold text-foreground">Student Profile</h1>
                <p className="text-muted-foreground">ID: {studentId}</p>
            </header>
            
            <section className="glass-panel rounded-xl border border-border shadow-sm p-6 text-foreground">
                <p>Profile data will be synced via WatermelonDB.</p>
            </section>
        </div>
    );
}

export default function StudentProfile({ params }: { params: { studentId: string } }) {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <header className="pb-4 border-b">
                <h1 className="text-3xl font-extrabold text-slate-900">Student Profile</h1>
                <p className="text-slate-500">ID: {params.studentId}</p>
            </header>
            
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-slate-700">
                <p>Profile data will be synced via WatermelonDB.</p>
            </section>
        </div>
    );
}

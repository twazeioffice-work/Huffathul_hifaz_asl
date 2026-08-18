export default function CourseManagement() {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <header className="pb-4 border-b">
                <h1 className="text-3xl font-extrabold text-slate-900">Course Management</h1>
                <p className="text-slate-500">Hierarchical mapping of courses and modules</p>
            </header>
            
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
                <p>Select an academic year to manage syllabus structure.</p>
            </section>
        </div>
    );
}

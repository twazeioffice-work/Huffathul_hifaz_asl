"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function StaffIntakeWizard() {
    const router = useRouter();
    const params = useParams();
    const { institutionCode, branchCode } = params as { institutionCode: string, branchCode: string };

    const [formData, setFormData] = useState({
        name: '', 
        role: 'USTAD', 
        salary: '', 
        joiningDate: '',
        email: '',
        phone: '',
        emergencyContact: '',
        education: '',
        cvUrl: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`/api/v1/erp/staff`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    branchCode // Pass the actual branchCode from the URL!
                })
            });

            if (res.ok) {
                alert("Employee Saved! System account auto-provisioned if email provided.");
                router.push(`/app/${institutionCode}/${branchCode}/erp/staff`);
            } else {
                const err = await res.json();
                alert(`Error: ${err.error}`);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to save employee.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 p-8 flex items-center justify-center font-sans">
            <div className="bg-slate-950 w-full max-w-2xl rounded-xl shadow-2xl border border-slate-800 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <h2 className="text-white font-bold text-lg flex items-center gap-2">
                        <span className="text-emerald-500">+</span> Hire New Employee
                    </h2>
                    <button type="button" onClick={() => router.back()} className="text-slate-400 hover:text-white">✕</button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Full Name</label>
                            <input name="name" onChange={handleChange} className="bg-slate-900 border border-slate-800 text-white p-2.5 rounded-lg w-full focus:border-emerald-500 focus:outline-none" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Role / Designation</label>
                            <select name="role" onChange={handleChange} className="bg-slate-900 border border-slate-800 text-white p-2.5 rounded-lg w-full focus:border-emerald-500 focus:outline-none">
                                <option value="USTAD">Ustad</option>
                                <option value="NAZIM">Nazim</option>
                                <option value="CENTER_ADMIN">Center Admin</option>
                                <option value="SUPPORT STAFF">Support Staff</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Monthly Salary (₹)</label>
                            <input name="salary" type="number" onChange={handleChange} className="bg-slate-900 border border-slate-800 text-white p-2.5 rounded-lg w-full focus:border-emerald-500 focus:outline-none" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Joining Date</label>
                            <input name="joiningDate" type="date" onChange={handleChange} className="bg-slate-900 border border-slate-800 text-white p-2.5 rounded-lg w-full focus:border-emerald-500 focus:outline-none [color-scheme:dark]" />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-1">System Access & Contact</h3>
                        <p className="text-xs text-slate-400 mb-3">If an email is provided and role is not "SUPPORT STAFF", they will be emailed system login credentials.</p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-emerald-500 mb-1 uppercase tracking-wider">Email Address (For Login)</label>
                                <input name="email" type="email" onChange={handleChange} className="bg-slate-900 border border-slate-800 text-white p-2.5 rounded-lg w-full focus:border-emerald-500 focus:outline-none" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Phone Number</label>
                                    <input name="phone" onChange={handleChange} className="bg-slate-900 border border-slate-800 text-white p-2.5 rounded-lg w-full focus:border-emerald-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Emergency Contact</label>
                                    <input name="emergencyContact" onChange={handleChange} className="bg-slate-900 border border-slate-800 text-white p-2.5 rounded-lg w-full focus:border-emerald-500 focus:outline-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Educational Qualification</label>
                                <input name="education" placeholder="e.g. B.Tech, High School" onChange={handleChange} className="bg-slate-900 border border-slate-800 text-white p-2.5 rounded-lg w-full focus:border-emerald-500 focus:outline-none" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">CV / Resume Drive URL</label>
                                <input name="cvUrl" placeholder="https://..." onChange={handleChange} className="bg-slate-900 border border-slate-800 text-white p-2.5 rounded-lg w-full focus:border-emerald-500 focus:outline-none" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4 mt-4 border-t border-slate-800">
                        <button type="button" onClick={() => router.back()} className="text-sm font-bold text-slate-300 hover:text-white">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="bg-emerald-500 text-emerald-950 text-sm px-6 py-2.5 rounded-lg font-bold shadow hover:bg-emerald-400 transition-colors disabled:opacity-50 flex items-center gap-2">
                            {isLoading ? 'Saving...' : '✓ Save Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

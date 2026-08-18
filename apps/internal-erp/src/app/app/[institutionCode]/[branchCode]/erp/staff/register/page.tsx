"use client";

import { useState } from 'react';

export default function StaffIntakeWizard() {
    const [formData, setFormData] = useState({
        full_name: '', email: '', employee_code: '', designation: ''
    });

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        alert("Staff Registration Sent! (Mocked)");
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Staff Registration Intake</h2>
            
            <form onSubmit={handleSubmit} className="border p-4 rounded bg-white shadow-sm space-y-4">
                <div className="mb-2">
                    <label className="block text-sm font-semibold mb-1">Full Name</label>
                    <input name="full_name" onChange={handleChange} className="border p-2 w-full" required />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-semibold mb-1">Email</label>
                    <input name="email" type="email" onChange={handleChange} className="border p-2 w-full" required />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-semibold mb-1">Employee Code</label>
                    <input name="employee_code" onChange={handleChange} className="border p-2 w-full" required />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-semibold mb-1">Designation</label>
                    <input name="designation" onChange={handleChange} className="border p-2 w-full" required />
                </div>
                
                <button type="submit" className="bg-green-600 text-white px-4 py-2 mt-4 rounded w-full font-bold shadow hover:bg-green-700">
                    Register Employee
                </button>
            </form>
        </div>
    );
}

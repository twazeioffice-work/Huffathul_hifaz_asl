import os

BASE_DIR = r"E:\Huffathul Hifaaz_asl\apps\internal-erp\src\app\app\[institutionCode]\[branchCode]\erp"

PAGES = {
    "staff-payroll": {
        "title": "Staff Payroll",
        "description": "Secure payroll management, salary disbursements, and tax reporting.",
        "icon": "CreditCard"
    },
    "master-ledger": {
        "title": "Master Ledger",
        "description": "General ledger, journal entries, and financial reconciliation.",
        "icon": "BookOpen"
    },
    "assets-fleet": {
        "title": "Assets & Fleet",
        "description": "Track institution assets, vehicles, and maintenance logs.",
        "icon": "Truck"
    },
    "complaints": {
        "title": "Complaints & Grievances",
        "description": "Anonymous and registered complaint resolution system.",
        "icon": "AlertCircle"
    },
    "ustads": {
        "title": "Ustads Management",
        "description": "Manage teaching staff, schedules, and performance evaluations.",
        "icon": "Users"
    },
    "whatsapp": {
        "title": "WhatsApp Integration",
        "description": "Automated WhatsApp alerts for parents and staff.",
        "icon": "MessageSquare"
    },
    "kitchen": {
        "title": "Kitchen & Inventory",
        "description": "Mess management, food inventory, and daily menus.",
        "icon": "Utensils"
    },
    "academics/attendance": {
        "title": "Daily Attendance",
        "description": "Record and manage daily student attendance.",
        "icon": "CalendarCheck"
    },
    "academics/hifz-sabaq": {
        "title": "Hifz Sabaq",
        "description": "Track daily new lesson (Sabaq) memorization progress.",
        "icon": "Book"
    },
    "academics/sabqi": {
        "title": "Sabqi (Recent Revision)",
        "description": "Track recent lesson revisions (Sabqi).",
        "icon": "RefreshCw"
    },
    "academics/manzil": {
        "title": "Manzil (Old Revision)",
        "description": "Track comprehensive old revisions (Manzil).",
        "icon": "Layers"
    },
    "academics/adab": {
        "title": "Adab & Tarbiyah",
        "description": "Monitor student behavior, discipline, and moral development.",
        "icon": "Heart"
    }
}

TEMPLATE = """"use client";

import React from "react";
import {{ GlassCard }} from "@/components/ui/GlassCard";
import {{ Button }} from "@/components/ui/Button";
import {{ {icon} }} from "lucide-react";

export default function {component_name}Page() {{
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">Generate Report</Button>
          <Button variant="primary">Add Record</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <GlassCard className="p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="p-4 bg-indigo-500/10 rounded-full mb-4">
            <{icon} className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No data found</h2>
          <p className="text-zinc-400 max-w-md">
            The {title} module is currently empty or pending backend connection. 
            Secure infrastructure provisioning is required to load these records.
          </p>
          <Button variant="primary" className="mt-6">Initialize Module</Button>
        </GlassCard>
      </div>
    </div>
  );
}}
"""

def generate_pages():
    for path, meta in PAGES.items():
        full_dir = os.path.join(BASE_DIR, path.replace("/", "\\"))
        os.makedirs(full_dir, exist_ok=True)
        
        # Convert path like "academics/hifz-sabaq" to "AcademicsHifzSabaq"
        comp_name = "".join([part.capitalize() for part in path.replace("/", "-").split("-")])
        
        file_path = os.path.join(full_dir, "page.tsx")
        
        content = TEMPLATE.format(
            title=meta["title"],
            description=meta["description"],
            icon=meta["icon"],
            component_name=comp_name
        )
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        
        print(f"Created: {file_path}")

if __name__ == "__main__":
    generate_pages()

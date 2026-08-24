import os

BASE_DIR = r"E:\Huffathul Hifaaz_asl\apps\internal-erp\src\app\app\[institutionCode]\[branchCode]\erp"

PAYROLL_CODE = """\"use client\";
import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Search, DollarSign, Users, CheckCircle, AlertCircle } from "lucide-react";

const MOCK_STAFF = [
  { id: "EMP-001", name: "Ahmed Abdullah", role: "Ustad", salary: 45000, status: "paid" },
  { id: "EMP-002", name: "Omar Farooq", role: "Nazim", salary: 60000, status: "pending" },
  { id: "EMP-003", name: "Zaid Bin Harith", role: "Security", salary: 25000, status: "paid" },
];

export default function StaffPayrollPage() {
  const [search, setSearch] = useState("");
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Staff Payroll</h1>
          <p className="text-sm text-zinc-400">Manage monthly disbursements and salary slips.</p>
        </div>
        <Button variant="primary">Process Payroll</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-lg"><Users /></div>
          <div><p className="text-sm text-zinc-400">Total Staff</p><p className="text-2xl font-bold text-white">42</p></div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 bg-green-500/20 text-green-400 rounded-lg"><DollarSign /></div>
          <div><p className="text-sm text-zinc-400">Total Disbursed</p><p className="text-2xl font-bold text-white">$124,500</p></div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-lg"><AlertCircle /></div>
          <div><p className="text-sm text-zinc-400">Pending Clearances</p><p className="text-2xl font-bold text-white">3</p></div>
        </GlassCard>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-white/5 relative">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
          <input type="text" placeholder="Search staff..." className="w-full max-w-md bg-white/5 border border-white/10 rounded-md py-2 pl-9 pr-4 text-sm text-white focus:outline-none" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <table className="w-full text-left">
          <thead className="bg-black/20 border-b border-white/10">
            <tr>
              <th className="p-4 text-zinc-400 font-medium">Emp ID</th>
              <th className="p-4 text-zinc-400 font-medium">Name</th>
              <th className="p-4 text-zinc-400 font-medium">Role</th>
              <th className="p-4 text-zinc-400 font-medium text-right">Base Salary</th>
              <th className="p-4 text-zinc-400 font-medium text-center">Status</th>
              <th className="p-4 text-zinc-400 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_STAFF.map(staff => (
              <tr key={staff.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-4 text-zinc-500">{staff.id}</td>
                <td className="p-4 text-white font-medium">{staff.name}</td>
                <td className="p-4 text-zinc-400">{staff.role}</td>
                <td className="p-4 text-white text-right">${staff.salary.toLocaleString()}</td>
                <td className="p-4 text-center">
                  <Badge variant={staff.status === 'paid' ? 'success' : 'warning'}>{staff.status.toUpperCase()}</Badge>
                </td>
                <td className="p-4 text-right"><Button variant="secondary">View Slip</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
"""

LEDGER_CODE = """\"use client\";
import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BookOpen, TrendingUp, TrendingDown, FileText } from "lucide-react";

const MOCK_ENTRIES = [
  { id: "TXN-8991", date: "2026-08-20", desc: "Student Tuition Fees", type: "credit", amount: 12500, balance: 145000 },
  { id: "TXN-8992", date: "2026-08-21", desc: "Utility Bills (Electricity)", type: "debit", amount: 850, balance: 144150 },
  { id: "TXN-8993", date: "2026-08-22", desc: "Charity Donation", type: "credit", amount: 5000, balance: 149150 },
];

export default function MasterLedgerPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Master Ledger</h1>
          <p className="text-sm text-zinc-400">Institutional general ledger and financial reconciliation.</p>
        </div>
        <Button variant="primary" className="flex gap-2 items-center"><FileText size={16}/> Export CSV</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-zinc-400 mb-2">Total Operating Balance</h3>
          <p className="text-4xl font-bold text-white">$149,150.00</p>
          <div className="mt-4 flex gap-4">
            <div className="flex items-center gap-2 text-green-400"><TrendingUp size={16}/> +12% this month</div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/20 border-b border-white/10">
            <tr>
              <th className="p-4 text-zinc-400 font-medium">Date</th>
              <th className="p-4 text-zinc-400 font-medium">Txn ID</th>
              <th className="p-4 text-zinc-400 font-medium">Description</th>
              <th className="p-4 text-zinc-400 font-medium text-right">Debit (-)</th>
              <th className="p-4 text-zinc-400 font-medium text-right">Credit (+)</th>
              <th className="p-4 text-zinc-400 font-medium text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ENTRIES.map(entry => (
              <tr key={entry.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-4 text-zinc-400">{entry.date}</td>
                <td className="p-4 text-zinc-500">{entry.id}</td>
                <td className="p-4 text-white">{entry.desc}</td>
                <td className="p-4 text-red-400 text-right">{entry.type === 'debit' ? `$${entry.amount}` : '-'}</td>
                <td className="p-4 text-green-400 text-right">{entry.type === 'credit' ? `$${entry.amount}` : '-'}</td>
                <td className="p-4 text-white font-medium text-right">${entry.balance.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
"""

ASSETS_CODE = """\"use client\";
import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Truck, Wrench, Calendar, MapPin } from "lucide-react";

const MOCK_FLEET = [
  { id: "BUS-01", type: "Toyota Coaster", plate: "HIFZ-123", status: "active", nextService: "2026-09-15", route: "Downtown Route" },
  { id: "BUS-02", type: "Nissan Civilian", plate: "HIFZ-456", status: "maintenance", nextService: "2026-08-25", route: "N/A" },
  { id: "VAN-01", type: "Toyota Hiace", plate: "HIFZ-789", status: "active", nextService: "2026-10-01", route: "Suburbs" },
];

export default function AssetsFleetPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Assets & Fleet</h1>
          <p className="text-sm text-zinc-400">Track institutional vehicles, maintenance, and routes.</p>
        </div>
        <Button variant="primary">Register Asset</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_FLEET.map(vehicle => (
          <GlassCard key={vehicle.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{vehicle.id}</h3>
                <p className="text-sm text-zinc-400">{vehicle.type}</p>
              </div>
              <Badge variant={vehicle.status === 'active' ? 'success' : 'warning'}>{vehicle.status.toUpperCase()}</Badge>
            </div>
            
            <div className="space-y-3 mt-6">
              <div className="flex items-center gap-3 text-zinc-300">
                <Truck size={16} className="text-indigo-400"/> <span>{vehicle.plate}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-300">
                <MapPin size={16} className="text-indigo-400"/> <span>{vehicle.route}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-300">
                <Wrench size={16} className="text-indigo-400"/> <span>Service: {vehicle.nextService}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/10 flex gap-2">
              <Button variant="secondary" className="w-full">Log Trip</Button>
              <Button variant="secondary" className="w-full">Maintenance</Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
"""

COMPLAINTS_CODE = """\"use client\";
import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AlertCircle, Search, MessageSquare } from "lucide-react";

const MOCK_COMPLAINTS = [
  { id: "TKT-101", from: "Parent (STU-001)", subject: "Transport Delay", severity: "medium", status: "open", date: "Today" },
  { id: "TKT-102", from: "Ustad (EMP-001)", subject: "AC Malfunction in Halqa 3", severity: "high", status: "investigating", date: "Yesterday" },
  { id: "TKT-103", from: "Anonymous", subject: "Cafeteria Food Quality", severity: "low", status: "resolved", date: "Aug 15" },
];

export default function ComplaintsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Complaints & Grievances</h1>
          <p className="text-sm text-zinc-400">Centralized ticket management and resolution system.</p>
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/20 border-b border-white/10">
            <tr>
              <th className="p-4 text-zinc-400 font-medium">Ticket ID</th>
              <th className="p-4 text-zinc-400 font-medium">Reporter</th>
              <th className="p-4 text-zinc-400 font-medium">Subject</th>
              <th className="p-4 text-zinc-400 font-medium">Severity</th>
              <th className="p-4 text-zinc-400 font-medium">Status</th>
              <th className="p-4 text-zinc-400 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_COMPLAINTS.map(ticket => (
              <tr key={ticket.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-4 text-zinc-500">{ticket.id}</td>
                <td className="p-4 text-white">{ticket.from}</td>
                <td className="p-4 text-white font-medium">{ticket.subject}</td>
                <td className="p-4">
                  <Badge variant={ticket.severity === 'high' ? 'danger' : ticket.severity === 'medium' ? 'warning' : 'default'}>
                    {ticket.severity.toUpperCase()}
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge variant={ticket.status === 'resolved' ? 'success' : ticket.status === 'investigating' ? 'warning' : 'danger'}>
                    {ticket.status.toUpperCase()}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <Button variant="secondary" className="px-3 py-1 text-xs">View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
"""

USTADS_CODE = """\"use client\";
import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Users, Star, BookOpen } from "lucide-react";

const MOCK_USTADS = [
  { id: "EMP-001", name: "Ahmed Abdullah", halqa: "Hifz Class A", students: 15, rating: 4.8 },
  { id: "EMP-004", name: "Ibrahim Khalid", halqa: "Hifz Class B", students: 12, rating: 4.5 },
  { id: "EMP-005", name: "Yusuf Rahman", halqa: "Nazira Class", students: 20, rating: 4.9 },
];

export default function UstadsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Ustads Management</h1>
          <p className="text-sm text-zinc-400">Manage teaching staff, assigned Halqas, and performance metrics.</p>
        </div>
        <Button variant="primary">Add Ustad</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_USTADS.map(ustad => (
          <GlassCard key={ustad.id} className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xl font-bold">
                {ustad.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{ustad.name}</h3>
                <p className="text-sm text-zinc-400">{ustad.id}</p>
              </div>
            </div>
            
            <div className="space-y-3 mt-6">
              <div className="flex items-center justify-between text-zinc-300">
                <div className="flex items-center gap-2"><BookOpen size={16} className="text-indigo-400"/> Halqa</div>
                <span className="text-white font-medium">{ustad.halqa}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <div className="flex items-center gap-2"><Users size={16} className="text-indigo-400"/> Students</div>
                <span className="text-white font-medium">{ustad.students} assigned</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <div className="flex items-center gap-2"><Star size={16} className="text-yellow-400"/> Rating</div>
                <span className="text-white font-medium">{ustad.rating} / 5.0</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/10 flex gap-2">
              <Button variant="secondary" className="w-full">View Profile</Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
"""

WHATSAPP_CODE = """\"use client\";
import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MessageSquare, Settings, Send, CheckCircle2 } from "lucide-react";

export default function WhatsAppPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">WhatsApp Integration</h1>
          <p className="text-sm text-zinc-400">Automated messaging, broadcast lists, and API configuration.</p>
        </div>
        <Button variant="secondary" className="flex gap-2 items-center"><Settings size={16}/> API Settings</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 md:col-span-1 border-green-500/30 bg-green-500/5 flex flex-col items-center text-center justify-center">
          <CheckCircle2 size={48} className="text-green-400 mb-4" />
          <h3 className="text-lg font-bold text-white">API Connected</h3>
          <p className="text-sm text-zinc-400 mt-2">Twilio/Meta WhatsApp API is active and receiving webhooks.</p>
          <Badge variant="success" className="mt-4">Live</Badge>
        </GlassCard>

        <GlassCard className="p-6 md:col-span-2">
          <h3 className="text-lg font-bold text-white mb-4">Quick Broadcast</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Target Audience</label>
              <select className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-white">
                <option>All Parents</option>
                <option>All Staff</option>
                <option>Specific Halqa Parents</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Message Template</label>
              <textarea rows={4} className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-white" defaultValue="Assalamu Alaikum. This is a reminder regarding..."></textarea>
            </div>
            <div className="flex justify-end">
              <Button variant="primary" className="flex gap-2 items-center"><Send size={16}/> Send Broadcast</Button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
"""

KITCHEN_CODE = """\"use client\";
import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Utensils, AlertTriangle, Plus } from "lucide-react";

const MOCK_INVENTORY = [
  { id: "INV-001", item: "Basmati Rice (50kg)", qty: 12, min: 5, status: "healthy" },
  { id: "INV-002", item: "Cooking Oil (10L)", qty: 3, min: 5, status: "low" },
  { id: "INV-003", item: "Wheat Flour (20kg)", qty: 0, min: 3, status: "out" },
];

export default function KitchenPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Kitchen & Inventory</h1>
          <p className="text-sm text-zinc-400">Manage mess inventory, grocery stock levels, and consumption.</p>
        </div>
        <Button variant="primary" className="flex gap-2 items-center"><Plus size={16}/> Add Stock</Button>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/20 border-b border-white/10">
            <tr>
              <th className="p-4 text-zinc-400 font-medium">Item Code</th>
              <th className="p-4 text-zinc-400 font-medium">Description</th>
              <th className="p-4 text-zinc-400 font-medium text-center">Current Qty</th>
              <th className="p-4 text-zinc-400 font-medium text-center">Min Threshold</th>
              <th className="p-4 text-zinc-400 font-medium">Status</th>
              <th className="p-4 text-zinc-400 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_INVENTORY.map(item => (
              <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-4 text-zinc-500">{item.id}</td>
                <td className="p-4 text-white font-medium">{item.item}</td>
                <td className="p-4 text-white text-center font-bold">{item.qty}</td>
                <td className="p-4 text-zinc-400 text-center">{item.min}</td>
                <td className="p-4">
                  <Badge variant={item.status === 'healthy' ? 'success' : item.status === 'low' ? 'warning' : 'danger'}>
                    {item.status.toUpperCase()}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <Button variant="secondary" className="px-3 py-1 text-xs">Update Qty</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
"""

FILES = {
    "staff-payroll": PAYROLL_CODE,
    "master-ledger": LEDGER_CODE,
    "assets-fleet": ASSETS_CODE,
    "complaints": COMPLAINTS_CODE,
    "ustads": USTADS_CODE,
    "whatsapp": WHATSAPP_CODE,
    "kitchen": KITCHEN_CODE
}

for path, code in FILES.items():
    full_path = os.path.join(BASE_DIR, path, "page.tsx")
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(code)
    print(f"Updated {path}")

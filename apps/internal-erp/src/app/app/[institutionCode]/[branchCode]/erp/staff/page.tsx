"use client";

import React from "react";
import { useParams } from "next/navigation";
import { UniversalDashboardLayout } from "@/components/dashboard/UniversalDashboardLayout";
import { getSidebarLinks } from "@/components/dashboard/universal-page-schemas";
import { Users, Briefcase, MapPin, ShieldCheck, Plus } from "lucide-react";

export default function StaffDirectory() {
  const params = useParams();
  const institutionCode = params.institutionCode as string;
  const branchCode = params.branchCode as string;

  const tenant = `${institutionCode}-${branchCode}`;

  const pageSchema = {
    tenantName: tenant.toUpperCase(),
    pageTitle: "Staff Directory",
    pageSubtitle: "Manage employees, center assignments, and job descriptions.",
    metrics: [
      {
        id: "staff-m1",
        title: "Total Staff",
        value: "48",
        changeLabel: "+2 this month",
        isPositive: true,
        statusText: "Active",
        statusType: "success" as const,
        icon: Users
      },
      {
        id: "staff-m2",
        title: "Academic Faculty",
        value: "35",
        statusText: "Teachers & Ustads",
        statusType: "info" as const,
        icon: Briefcase
      },
      {
        id: "staff-m3",
        title: "Active Centers",
        value: "4",
        statusText: "Operating Locations",
        statusType: "success" as const,
        icon: MapPin
      },
      {
        id: "staff-m4",
        title: "Super Admins",
        value: "2",
        statusText: "System Root Access",
        statusType: "warning" as const,
        icon: ShieldCheck
      }
    ],
    primaryTable: {
      title: "Active Employees",
      subtitle: "Comprehensive roster across all centers",
      actions: (
        <button className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)]">
          <Plus className="h-4 w-4" />
          <span>Add Employee</span>
        </button>
      ),
      headers: ["Employee ID", "Name", "Department", "Center/Branch", "Job Description", "Role", "Actions"],
      rows: [
        {
          id: "EMP-3001",
          columns: [
            { key: "id", value: "EMP-3001", styleClass: "font-mono text-blue-400 font-bold" },
            { key: "name", value: "Ustad Bilal" },
            { key: "department", value: "Academic" },
            { key: "center", value: "MAIN CAMPUS" },
            { key: "job", value: "Senior Hifz Instructor" },
            { key: "role", value: "Teacher", styleClass: "text-emerald-400 text-xs font-bold uppercase" },
            { key: "action", value: "Edit Profile" }
          ]
        },
        {
          id: "EMP-3002",
          columns: [
            { key: "id", value: "EMP-3002", styleClass: "font-mono text-blue-400 font-bold" },
            { key: "name", value: "Abdullah Siddiqui" },
            { key: "department", value: "Administration" },
            { key: "center", value: "ALL CENTERS" },
            { key: "job", value: "ERP Systems Administrator" },
            { key: "role", value: "Super Admin", styleClass: "text-rose-400 text-xs font-bold uppercase" },
            { key: "action", value: "Edit Profile" }
          ]
        },
        {
          id: "EMP-3003",
          columns: [
            { key: "id", value: "EMP-3003", styleClass: "font-mono text-blue-400 font-bold" },
            { key: "name", value: "Sheikh Tariq" },
            { key: "department", value: "Academic" },
            { key: "center", value: "NORTH BRANCH" },
            { key: "job", value: "Tajweed Specialist" },
            { key: "role", value: "Teacher", styleClass: "text-emerald-400 text-xs font-bold uppercase" },
            { key: "action", value: "Edit Profile" }
          ]
        }
      ]
    }
  };

  const sidebarLinks = getSidebarLinks("staff");

  return (
    <UniversalDashboardLayout
      schema={pageSchema}
      sidebarLinks={sidebarLinks}
      onSidebarClick={(id) => {
        window.location.href = `/app/${institutionCode}/${branchCode}/erp/${id === 'dashboard' ? '' : id}`;
      }}
    />
  );
}

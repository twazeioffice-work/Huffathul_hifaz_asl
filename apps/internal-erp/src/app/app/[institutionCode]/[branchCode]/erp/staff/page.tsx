"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { UniversalDashboardLayout } from "@/components/dashboard/UniversalDashboardLayout";
import { getSidebarLinks } from "@/components/dashboard/universal-page-schemas";
import { Users, Briefcase, MapPin, ShieldCheck, Plus } from "lucide-react";
import { useFaculty, useOtherStaff } from "@/hooks/useLiveApi";
import { Spinner } from "@heroui/react";

export default function StaffDirectory() {
  const params = useParams();
  const institutionCode = params.institutionCode as string;
  const branchCode = params.branchCode as string;

  const tenant = `${institutionCode}-${branchCode}`;
  
  // Live API Hooks
  const { faculty, totalCount: facultyCount, isLoading: facultyLoading } = useFaculty();
  const { staff, totalCount: staffCount, isLoading: staffLoading } = useOtherStaff();

  const totalStaff = facultyCount + staffCount;

  // Process rows dynamically based on the live data
  const dynamicRows = useMemo(() => {
    if (facultyLoading || staffLoading) return [];

    const rows: any[] = [];
    
    // Process Faculty
    if (faculty && Array.isArray(faculty)) {
      faculty.forEach((f: any) => {
        rows.push({
          id: f.id,
          columns: [
            { key: "id", value: f.id.split('-')[0].toUpperCase(), styleClass: "font-mono text-blue-400 font-bold text-xs" },
            { key: "name", value: f.name },
            { key: "department", value: "Academic" },
            { key: "center", value: f.branch_name || "Assigned Center" },
            { key: "job", value: "Instructor" },
            { key: "role", value: f.role || "Teacher", styleClass: "text-emerald-400 text-xs font-bold uppercase" },
            { key: "action", value: "Edit Profile" }
          ]
        });
      });
    }

    // Process Other Staff
    if (staff && Array.isArray(staff)) {
      staff.forEach((s: any) => {
        rows.push({
          id: s.id,
          columns: [
            { key: "id", value: s.id.split('-')[0].toUpperCase(), styleClass: "font-mono text-purple-400 font-bold text-xs" },
            { key: "name", value: s.name },
            { key: "department", value: "Operations" },
            { key: "center", value: "Various" },
            { key: "job", value: s.role },
            { key: "role", value: "Support Staff", styleClass: "text-amber-400 text-xs font-bold uppercase" },
            { key: "action", value: "Edit Profile" }
          ]
        });
      });
    }

    return rows;
  }, [faculty, staff, facultyLoading, staffLoading]);


  const pageSchema = {
    tenantName: tenant.toUpperCase(),
    pageTitle: "Staff Directory",
    pageSubtitle: "Manage employees, center assignments, and job descriptions.",
    metrics: [
      {
        id: "staff-m1",
        title: "Total Staff",
        value: (facultyLoading || staffLoading) ? <Spinner size="sm" color="white"/> : totalStaff.toString(),
        changeLabel: "Live via FastAPI",
        isPositive: true,
        statusText: "Active",
        statusType: "success" as const,
        icon: Users
      },
      {
        id: "staff-m2",
        title: "Academic Faculty",
        value: facultyLoading ? <Spinner size="sm" color="white"/> : facultyCount.toString(),
        statusText: "Teachers & Ustads",
        statusType: "info" as const,
        icon: Briefcase
      },
      {
        id: "staff-m3",
        title: "Operations Staff",
        value: staffLoading ? <Spinner size="sm" color="white"/> : staffCount.toString(),
        statusText: "Clerks, Drivers, etc.",
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
      rows: dynamicRows
    }
  };

  const sidebarLinks = getSidebarLinks(institutionCode, branchCode);

  return (
    <UniversalDashboardLayout
      pageSchema={pageSchema}
      sidebarLinks={sidebarLinks}
      onSidebarClick={(id) => {
        window.location.href = `/app/${institutionCode}/${branchCode}/erp/${id === 'dashboard' ? '' : id}`;
      }}
    />
  );
}

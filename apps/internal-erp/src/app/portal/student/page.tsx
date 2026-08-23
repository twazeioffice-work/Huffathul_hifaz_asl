import React from "react";
import { cookies } from "next/headers";
import StudentPortalDashboard from "./Dashboard";

// Secure internal fetch wrapper
async function fetchPortalData(endpoint: string) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  
  if (!sessionToken) return null;
  
  try {
    const res = await fetch(`${process.env.INTERNAL_API_URL}/api/v1/portal/${endpoint}`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
      cache: "no-store"
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error(`Failed to fetch ${endpoint}:`, err);
    return null;
  }
}

export default async function StudentPortalPage() {
  // Parallel fetch the secure APIs we just built
  const [facilities, notices] = await Promise.all([
    fetchPortalData("facilities"),
    fetchPortalData("notices")
  ]);

  // Safely map facilities to enabledModules
  const enabledModules = {
    halqa: false,
    namaz: false,
    cleanliness: false,
    kithab: false,
    other_capabilities: false
  };

  if (facilities && Array.isArray(facilities)) {
    facilities.forEach((fac: any) => {
      // Best-effort mapping from facility record to module flags
      if (fac.facility_type?.toLowerCase() === 'halqa') enabledModules.halqa = fac.is_enabled;
      if (fac.facility_type?.toLowerCase() === 'namaz') enabledModules.namaz = fac.is_enabled;
      if (fac.facility_type?.toLowerCase() === 'cleanliness') enabledModules.cleanliness = fac.is_enabled;
      if (fac.facility_type?.toLowerCase() === 'kithab') enabledModules.kithab = fac.is_enabled;
    });
  }

  // Handle compliant submission securely via Server Action
  async function handleComplaintSubmit(data: any) {
    "use server";
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;
    
    if (!sessionToken) return { success: false, error: "Unauthorized" };
    
    try {
      const res = await fetch(`${process.env.INTERNAL_API_URL}/api/v1/portal/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        return { success: false, error: "Failed to submit complaint" };
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: "System failure" };
    }
  }

  return (
    <StudentPortalDashboard 
      studentName="Student User" // TODO: Fetch from profile API when available
      rollNumber="STU-001"
      centerName="Main Branch"
      sabaqGrade="A"
      sabaqJuz={5}
      sabaqPages="10-15"
      enabledModules={enabledModules}
      notices={notices || []}
      onComplaintSubmit={handleComplaintSubmit}
    />
  );
}

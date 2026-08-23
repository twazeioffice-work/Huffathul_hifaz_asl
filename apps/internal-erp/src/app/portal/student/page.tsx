import React from "react";
import StudentPortalDashboard from "./Dashboard";

export default async function StudentPortalPage() {
  return (
    <StudentPortalDashboard 
      studentName="Mock Student"
      rollNumber="STU-001"
      centerName="Main Branch"
      sabaqGrade="A"
      sabaqJuz={5}
      sabaqPages="10-15"
      enabledModules={{
        halqa: true,
        namaz: true,
        cleanliness: true,
        kithab: true,
        other_capabilities: false
      }}
      notices={[]}
      onComplaintSubmit={async (data) => {
        "use server";
        console.log("Complaint submitted", data);
        return { success: true };
      }}
    />
  );
}

"use client";

import React, { use } from "react";
import { useParams } from "next/navigation";
import StudentPortalDashboard from "@/app/portal/student/Dashboard";

export default function Page() {
    
    // Seeded data for visual verification
    const notices = [
      {
        id: "1",
        title: "Annual Qira'at Competition",
        content: "The final rounds will take place in the main hall after Asr.",
        category: "COMPETITION" as const,
        eventDate: "2026-09-15"
      },
      {
        id: "2",
        title: "Dastaar Bandi Function",
        content: "Graduation ceremony for the completing class of 2026.",
        category: "FUNCTION" as const,
        eventDate: "2026-10-01"
      }
    ];

    const resolvedParams = useParams() as { studentId: string };

    return (
      <StudentPortalDashboard 
        studentName="Saeed Al-Hasan"
        rollNumber={resolvedParams.studentId}
        centerName="Suffat-ul Huffaz HQ"
        sabaqGrade="A+"
        sabaqJuz={15}
        sabaqPages="12-14"
        enabledModules={{
          halqa: true,
          namaz: true,
          cleanliness: true,
          kithab: true,
          other_capabilities: false
        }}
        notices={notices}
        onComplaintSubmit={async (data) => {
          console.log("Complaint submitted (mock):", data);
          return { success: true };
        }}
      />
    );
}

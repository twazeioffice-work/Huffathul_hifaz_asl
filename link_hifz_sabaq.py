import os
import re

FILE_PATH = r"E:\Huffathul Hifaaz_asl\apps\internal-erp\src\app\app\[institutionCode]\[branchCode]\erp\academics\hifz-sabaq\page.tsx"

with open(FILE_PATH, "r", encoding="utf-8") as f:
    content = f.read()

# Replace MOCK_STUDENTS with state
NEW_CONTENT = content.replace(
"""// Mock Data for UI Demonstration
const MOCK_STUDENTS = [
  { id: "STU-001", name: "Ahmed Abdullah", status: "pending", lastSurah: "Al-Baqarah", lastAyah: 145 },
  { id: "STU-002", name: "Omar Farooq", status: "completed", lastSurah: "Al-Imran", lastAyah: 20 },
  { id: "STU-003", name: "Zaid Bin Harith", status: "pending", lastSurah: "An-Nisa", lastAyah: 5 },
  { id: "STU-004", name: "Ali Hassan", status: "absent", lastSurah: "Al-Ma'idah", lastAyah: 12 },
  { id: "STU-005", name: "Bilal Rabah", status: "pending", lastSurah: "Al-A'raf", lastAyah: 55 },
];""", "")

# Update imports to include useEffect
NEW_CONTENT = NEW_CONTENT.replace('import React, { useState } from "react";', 'import React, { useState, useEffect } from "react";')

# Inject state and fetch logic inside the component
fetch_logic = """  const [students, setStudents] = useState<any[]>([]);
  
  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        // Map database models to UI expectations
        const formatted = data.map((d: any) => ({
          id: d.studentCode,
          dbId: d.id,
          name: d.name,
          status: d.status,
          lastSurah: d.sabaqRecords?.[0]?.surah || "N/A",
          lastAyah: d.sabaqRecords?.[0]?.endAyah || 0
        }));
        setStudents(formatted);
      })
      .catch(console.error);
  }, []);

  const submitSabaq = async () => {
    if (!activeStudent) return;
    try {
      await fetch('/api/sabaq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: activeStudent.dbId,
          surah: formData.surah,
          startAyah: formData.startAyah,
          endAyah: formData.endAyah,
          mistakes: formData.mistakes,
          grade: formData.grade
        })
      });
      // Reset form and refresh
      setFormData({ surah: "", startAyah: "", endAyah: "", mistakes: "0", grade: "A" });
      setSelectedStudent(null);
      // Re-fetch logic would go here
    } catch (e) {
      console.error(e);
    }
  };"""

NEW_CONTENT = NEW_CONTENT.replace("const [search, setSearch] = useState(\"\");", "const [search, setSearch] = useState(\"\");\n" + fetch_logic)

# Replace MOCK_STUDENTS references with students
NEW_CONTENT = NEW_CONTENT.replace("MOCK_STUDENTS", "students")

# Bind the save button
NEW_CONTENT = NEW_CONTENT.replace(
"""<Button variant="primary" className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Save Sabaq Record
                </Button>""",
"""<Button variant="primary" className="flex items-center gap-2" onClick={submitSabaq}>
                  <CheckCircle className="w-4 h-4" /> Save Sabaq Record
                </Button>"""
)

with open(FILE_PATH, "w", encoding="utf-8") as f:
    f.write(NEW_CONTENT)

print("Hifz Sabaq linked to API.")

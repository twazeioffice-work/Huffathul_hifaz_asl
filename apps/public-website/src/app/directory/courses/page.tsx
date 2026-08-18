import { BookOpen, Clock, Calendar, GraduationCap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import SchemaMarkup from "@/components/SchemaMarkup";

export const metadata = {
  title: "Academic Programs & Curriculum Directory | Suffat-ul Huffaz",
  description:
    "Explore our accredited Quranic memorization syllabi, Tajweed certifications, and Alimiyah curriculum tracks.",
};

const courses = [
  {
    code: "HIFZ-101",
    name: "Full-Time Tahfeez-ul Quran",
    duration: "3 Years (Full-Time)",
    schedule: "Daily Residential / Day-Boarding",
    description:
      "Structured memorization of all 30 Juz with rigorous daily Sabaq (new memorization), Sabqi (recent memorization review), and Manzil (cumulative retention cycle).",
    eligibility: "Ages 8-16 with foundational Nazirah fluency",
  },
  {
    code: "TAJ-201",
    name: "Advanced Tajweed & Tuhfat-ul Atfal",
    duration: "1 Year",
    schedule: "Weekend & Evening Options",
    description:
      "Intensive study of classical Tajweed poems, phonetics, rules of Noon Sakinah, Meem Sakinah, and rules of Madd with practical recitation correction.",
    eligibility: "Open to students & adult reciters",
  },
  {
    code: "ALM-301",
    name: "Integrated Alimiyah Dual Stream",
    duration: "6 Years",
    schedule: "Full-Time Academic Program",
    description:
      "Dual curriculum conferring certified Islamic scholarship (Nahw, Sarf, Hadith, Fiqh, Usul) alongside recognized secondary school board examinations.",
    eligibility: "Completed Hifz or Equivalent entrance test",
  },
  {
    code: "REV-401",
    name: "Hifz Retention & Daur Acceleration",
    duration: "6 Months - 1 Year",
    schedule: "Flexible Intensive",
    description:
      "Targeted consolidation for existing Huffaz to reinforce memorization fidelity before Sanad examination or national competitions.",
    eligibility: "Certified or Complete Huffaz requiring review",
  },
];

export default function CoursesDirectoryPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Academic Offerings
        </span>
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Curriculum & Course Tracks
        </h1>
        <p className="text-sm text-muted max-w-2xl">
          Standardized syllabi combining classical authenticity with structured pedagogical milestones.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card key={course.code} className="flex flex-col justify-between hover:border-primary/40 transition-colors">
            <SchemaMarkup
              courseName={course.name}
              courseCode={course.code}
              description={course.description}
              duration={course.duration}
            />

            <CardHeader>
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-xs font-bold text-primary bg-primary-light px-2 py-0.5 rounded">
                  {course.code}
                </span>
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <CardTitle className="text-xl">{course.name}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-xs text-muted leading-relaxed">
                {course.description}
              </p>

              <div className="pt-3 border-t border-border grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-primary" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary" />
                  <span>{course.schedule}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded text-[11px] text-foreground">
                <span className="font-semibold text-primary">Prerequisite:</span>{" "}
                {course.eligibility}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

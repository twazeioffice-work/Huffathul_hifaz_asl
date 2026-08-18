import Link from "next/link";
import { BookOpen, ShieldCheck, Award, Users, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

export default function HomePage() {
  const statistics = [
    { label: "Active Memorizers", value: "3,500+" },
    { label: "Certified Huffaz Graduated", value: "1,200+" },
    { label: "National Branches", value: "48" },
    { label: "Sanad-Accredited Faculty", value: "150+" },
  ];

  const corePrograms = [
    {
      title: "Full-Time Tahfeez-ul Quran",
      description: "Comprehensive 3-year memorization track integrating daily Sabaq, Sabqi, and Manzil reviews with tajweed mastery.",
      badge: "Core Track",
      href: "/directory/courses",
    },
    {
      title: "Tajweed & Qira'at Certification",
      description: "Advanced phonetics, articulation points (Makharij), and Sanad-chain transmission pathways.",
      badge: "Advanced",
      href: "/directory/courses",
    },
    {
      title: "Alimiyah Integrated Studies",
      description: "Dual-curriculum blending sacred Arabic grammar, Hadith, and Islamic jurisprudence with standard academia.",
      badge: "Integrated",
      href: "/directory/courses",
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 lg:pt-24 border-b border-border bg-gradient-to-b from-primary-light/30 to-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 rounded-full border border-primary/20 bg-primary-light/60 px-3.5 py-1 text-xs font-semibold text-primary shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admissions Now Open for Academic Year 2026–2027</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
            Sacred Memorization. <br className="hidden sm:inline" />
            <span className="text-primary italic">Standardized Excellence.</span>
          </h1>

          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Suffat-ul Huffaz bridges classical Quranic sanad traditions with modern,
            data-verified educational oversight across our national network of madaris.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/admission">
              <Button size="lg" className="w-full sm:w-auto shadow-md">
                Register for Admission
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/directory/courses">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explore Curriculum
              </Button>
            </Link>
          </div>

          {/* Statistics Grid */}
          <div className="pt-16 pb-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto border-t border-border/80 mt-12">
            {statistics.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="font-serif text-2xl sm:text-3xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flagship Academic Programs */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-foreground">
            Flagship Academic Programs
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            Curricula engineered to preserve classical rigor while ensuring psychological
            wellbeing, cognitive retention, and intellectual development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {corePrograms.map((program, idx) => (
            <Card key={idx} className="flex flex-col justify-between hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <span className="bg-primary-light text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {program.badge}
                  </span>
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <CardTitle>{program.title}</CardTitle>
                <CardDescription className="pt-2 leading-relaxed">
                  {program.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 border-t border-border">
                <Link
                  href={program.href}
                  className="text-xs font-bold text-primary hover:text-primary-hover inline-flex items-center"
                >
                  View Syllabus Details
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Institutional Pillars */}
      <section className="bg-card border-y border-border py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-foreground">
              The Suffat-ul Huffaz Standard
            </h2>
            <p className="text-sm text-muted">
              Why leading scholars and parents trust our pedagogical framework.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded bg-primary-light flex items-center justify-center text-primary">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold">Authenticated Sanad</h3>
              <p className="text-xs text-muted leading-relaxed">
                Direct lineage chains tracing back through authenticated mutawatir chains
                of Quranic recitation under authorized Shuyukh.
              </p>
            </div>

            <div className="space-y-3">
              <div className="h-10 w-10 rounded bg-primary-light flex items-center justify-center text-primary">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold">Ledger-Backed Retention</h3>
              <p className="text-xs text-muted leading-relaxed">
                Daily Sabaq, Sabqi, and Manzil revisions recorded on our high-resiliency
                ERP system to prevent memory decay and lapses.
              </p>
            </div>

            <div className="space-y-3">
              <div className="h-10 w-10 rounded bg-primary-light flex items-center justify-center text-primary">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold">Holistic Tarbiyah</h3>
              <p className="text-xs text-muted leading-relaxed">
                Comprehensive moral character development, physical wellness routines,
                and modern intellectual discourse.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

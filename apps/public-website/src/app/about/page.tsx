import { Shield, BookOpen, Award, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export const metadata = {
  title: "About Us | Suffat-ul Huffaz Network",
  description:
    "Learn about our founding mission, classical Quranic transmission lineage, and digital educational governance.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-12 md:py-16 space-y-16">
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Our Foundation & Philosophy
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground">
          Dedicated to the Preservation of the Sacred Text
        </h1>
        <p className="text-sm sm:text-base text-muted leading-relaxed">
          Established to institutionalize Quranic memorization with unprecedented
          quality, transparent accountability, and classical rigor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-sm text-muted leading-relaxed">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            The Tradition of Suffah
          </h2>
          <p>
            Taking inspiration from <em>As-Suffah</em>—the historic terrace of
            the Prophet’s Mosque in Madinah dedicated to knowledge and spiritual
            excellence—Suffat-ul Huffaz was founded to cultivate the next generation
            of righteous Quranic memorizers.
          </p>
          <p>
            We combine time-tested memorization methods (the Ottoman and Indo-Pak
            tri-partite review system of Sabaq, Sabqi, and Manzil) with modern
            educational analytics, ensuring no student is left behind.
          </p>
        </div>

        <Card className="bg-gradient-to-br from-primary-light/40 to-background border-primary/20 p-8 space-y-4">
          <h3 className="font-serif text-lg font-bold text-primary">Core Tenets</h3>
          <ul className="space-y-3 text-xs text-foreground">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-primary mr-2.5 mt-0.5 flex-shrink-0" />
              <span><strong>Pure Sanad Lineage:</strong> Every teacher possesses authenticated chains of transmission.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-primary mr-2.5 mt-0.5 flex-shrink-0" />
              <span><strong>Zero Compromise on Tajweed:</strong> Articulation accuracy evaluated daily.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-primary mr-2.5 mt-0.5 flex-shrink-0" />
              <span><strong>Psychological Care:</strong> Stress-free, nurturing spiritual environment.</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* Leadership Directory */}
      <div className="space-y-8 pt-8 border-t border-border">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Academic Directorate & Oversight
          </h2>
          <p className="text-xs text-muted">
            Guided by seasoned scholars and pedagogical administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Award className="w-6 h-6 text-primary mb-2" />
              <CardTitle>Shaykh Al-Qurra</CardTitle>
              <p className="text-xs text-muted-foreground">Chief of Quranic Transmission</p>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted">
                Holder of 10 Qira'at (Al-Ashr Al-Sughra) with over 30 years of teaching experience across Islamic universities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="w-6 h-6 text-primary mb-2" />
              <CardTitle>Dean of Academics</CardTitle>
              <p className="text-xs text-muted-foreground">Curriculum & Pedagogy</p>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted">
                Specialist in dual-stream classical Alimiyah and modern curriculum integration.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="w-6 h-6 text-primary mb-2" />
              <CardTitle>Director of Operations</CardTitle>
              <p className="text-xs text-muted-foreground">Governance & Accreditation</p>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted">
                Overseeing multi-branch standardisation, teacher certification, and student welfare standards.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card py-12 text-sm">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 rounded bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-sm">
              SH
            </div>
            <span className="font-serif font-bold text-foreground">
              Suffat-ul Huffaz
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Standardizing excellence in classical Quranic memorization, Tajweed,
            and contemporary Islamic scholarship across national branches.
          </p>
        </div>

        <div>
          <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-foreground mb-3">
            Academic Pathways
          </h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><Link href="/directory/courses" className="hover:text-primary transition-colors">Hifz-ul Quran Program</Link></li>
            <li><Link href="/directory/courses" className="hover:text-primary transition-colors">Tajweed & Qira'at Certification</Link></li>
            <li><Link href="/directory/courses" className="hover:text-primary transition-colors">Alimiyah Dual Curriculum</Link></li>
            <li><Link href="/directory/courses" className="hover:text-primary transition-colors">Adult Memorization Modules</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-foreground mb-3">
            Institutions & Network
          </h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><Link href="/directory/institutions" className="hover:text-primary transition-colors">Campus Directory</Link></li>
            <li><Link href="/about" className="hover:text-primary transition-colors">Mission & Vision</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Branch Locators</Link></li>
            <li><Link href="/admission" className="hover:text-primary transition-colors">Admissions Portal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-foreground mb-3">
            Legal & Trust
          </h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><span className="text-muted-foreground">Privacy Policy</span></li>
            <li><span className="text-muted-foreground">Terms of Governance</span></li>
            <li><span className="text-muted-foreground">Affiliation Verification</span></li>
            <li><span className="text-muted-foreground">ISO-Aligned Security</span></li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 pt-8 mt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Suffat-ul Huffaz Digital Educational Network. All rights reserved.</p>
        <p className="mt-2 sm:mt-0 font-mono text-[10px]">Zero-Trust Architecture • Project A Public</p>
      </div>
    </footer>
  );
}

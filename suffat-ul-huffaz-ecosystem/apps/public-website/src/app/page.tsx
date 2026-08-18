import React from 'react';

export default function PublicLandingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* JSON-LD Schema Injector */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "Suffat-ul Huffaz",
            "description": "Excellence in Hifz and Academic Sciences.",
            "url": "https://suffat.org"
          })
        }}
      />
      
      <header className="py-24 text-center bg-white border-b border-slate-200">
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
          Pioneering the Future of <span className="text-emerald-600">Hifz Education</span>
        </h1>
        <p className="mt-6 text-xl text-slate-500 max-w-3xl mx-auto">
          Enroll your child in a world-class environment that perfectly balances 
          Quranic memorization with modern temporal academics.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <a href="/admission" className="px-8 py-3 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition">
            Apply for Admission
          </a>
          <a href="/directory/institutions" className="px-8 py-3 bg-slate-100 text-slate-700 rounded-full font-semibold hover:bg-slate-200 transition">
            Explore Campuses
          </a>
        </div>
      </header>
    </main>
  );
}

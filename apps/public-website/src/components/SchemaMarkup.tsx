interface CourseSchemaProps {
  courseName: string;
  courseCode: string;
  description: string;
  duration?: string;
  institutionName?: string;
  branchLocation?: string;
}

export default function SchemaMarkup({
  courseName,
  courseCode,
  description,
  duration = "P1Y",
  institutionName = "Suffat-ul Huffaz Digital Educational Network",
  branchLocation = "National",
}: CourseSchemaProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: courseName,
    description: description,
    courseCode: courseCode,
    provider: {
      "@type": "EducationalOrganization",
      name: institutionName,
      address: {
        "@type": "PostalAddress",
        addressLocality: branchLocation,
      },
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "In-Person",
      duration: duration,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

import { MapPin, Phone, Mail, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import MapContainer from "@/components/MapContainer";

export const metadata = {
  title: "Campuses & Branches Directory | Suffat-ul Huffaz",
  description:
    "Explore our accredited national campuses and regional Quran memorization centers.",
};

const campuses = [
  {
    id: "1",
    name: "Suffat-ul Huffaz Central Campus (HQ)",
    city: "Hyderabad, Telangana",
    address: "Banjara Hills, Road No. 12, Hyderabad",
    phone: "+91 40 2345 6789",
    email: "central@suffat.org",
    latitude: 17.4126,
    longitude: 78.4398,
    facilities: ["Hostel", "Library", "Digital Labs", "Sports Arena"],
    type: "Flagship Residential Campus",
  },
  {
    id: "2",
    name: "Suffat-ul Huffaz Bengaluru East",
    city: "Bengaluru, Karnataka",
    address: "Frazer Town, Bengaluru",
    phone: "+91 80 9876 5432",
    email: "bengaluru@suffat.org",
    latitude: 12.9972,
    longitude: 77.6136,
    facilities: ["Day Boarding", "Tajweed Lab", "Cafeteria"],
    type: "Regional Academy",
  },
  {
    id: "3",
    name: "Suffat-ul Huffaz Mumbai North",
    city: "Mumbai, Maharashtra",
    address: "Andheri West, Mumbai",
    phone: "+91 22 8765 4321",
    email: "mumbai@suffat.org",
    latitude: 19.1136,
    longitude: 72.8697,
    facilities: ["Hostel", "Auditorium", "Smart Classrooms"],
    type: "Affiliated Full-Time Campus",
  },
];

export default function InstitutionsDirectoryPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          National Network
        </span>
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Campuses & Affiliated Centers
        </h1>
        <p className="text-sm text-muted max-w-2xl">
          Locate nearest accredited madrasah branch or residential tahfeez facility.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {campuses.map((campus) => (
            <Card key={campus.id} className="hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-primary-light text-primary px-2 py-0.5 rounded">
                      {campus.type}
                    </span>
                    <CardTitle className="mt-2 text-xl">{campus.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted">
                  <div className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-2 text-primary flex-shrink-0" />
                    <span>{campus.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-2 text-primary flex-shrink-0" />
                    <span>{campus.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-2 text-primary flex-shrink-0" />
                    <span>{campus.email}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex flex-wrap gap-2">
                  {campus.facilities.map((facility, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center text-[10px] bg-slate-100 text-foreground px-2 py-0.5 rounded font-medium"
                    >
                      <CheckCircle2 className="w-3 h-3 text-primary mr-1" />
                      {facility}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <div className="sticky top-24 space-y-4">
            <h3 className="font-serif text-base font-bold text-foreground">
              Campus Location Map
            </h3>
            <MapContainer
              latitude={17.4126}
              longitude={78.4398}
              branchName="Suffat-ul Huffaz Central Campus"
            />
            <p className="text-[11px] text-muted-foreground text-center">
              Showing Central HQ location. Click on individual campuses to view regional branches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

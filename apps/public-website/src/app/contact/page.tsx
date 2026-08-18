"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import MapContainer from "@/components/MapContainer";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().regex(/^\+?\d{10,14}$/, "Enter a valid phone number"),
  inquiry_type: z.enum(["General", "Admissions", "Affiliations", "Donations"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      inquiry_type: "General",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/lead-ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 429) {
        setError("root", {
          message: "Rate limit reached. Please wait a minute before sending another message.",
        });
        return;
      }

      if (!res.ok) {
        setError("root", { message: "Failed to transmit message. Please try again." });
        return;
      }

      setIsSubmitted(true);
      reset();
    } catch {
      setError("root", { message: "Network connection error." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-16 space-y-12">
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Get in Touch
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-foreground">
          Contact the Academic Directorate
        </h1>
        <p className="text-sm text-muted">
          Have questions regarding syllabus accreditation, admission quotas, or branch affiliations?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Form */}
        <Card className="p-6 sm:p-8 space-y-6">
          <CardHeader className="p-0 pb-4 border-b border-border">
            <CardTitle>Send an Official Inquiry</CardTitle>
          </CardHeader>

          {isSubmitted ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground">
                Inquiry Received
              </h3>
              <p className="text-xs text-muted max-w-xs mx-auto">
                Your message has been assigned a support ticket. Our administrative desk will reach out within 24 business hours.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSubmitted(false)}
                className="mt-4"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {errors.root && (
                <div className="bg-destructive/10 border border-destructive text-destructive text-xs p-3 rounded">
                  {errors.root.message}
                </div>
              )}

              <Input
                label="Full Name"
                {...register("name")}
                error={errors.name?.message}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  {...register("email")}
                  error={errors.email?.message}
                />
                <Input
                  label="Phone / WhatsApp"
                  placeholder="+91..."
                  {...register("phone")}
                  error={errors.phone?.message}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-foreground">
                  Inquiry Department
                </label>
                <select
                  {...register("inquiry_type")}
                  className="flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus-ring"
                >
                  <option value="General">General Inquiry</option>
                  <option value="Admissions">Admissions & Eligibility</option>
                  <option value="Affiliations">Madrasah Affiliation</option>
                  <option value="Donations">Endowments & Waqf</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-foreground">
                  Message Details
                </label>
                <textarea
                  {...register("message")}
                  rows={4}
                  className="flex w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-ring"
                  placeholder="Detail your inquiry here..."
                />
                {errors.message && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full justify-center"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Transmitting..." : "Send Inquiry"}
              </Button>
            </form>
          )}
        </Card>

        {/* Directory Coordinates & Lazyloaded Map */}
        <div className="space-y-6">
          <Card className="space-y-4">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-base">Headquarters & Directorate</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3 text-xs text-muted">
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2.5 text-primary flex-shrink-0 mt-0.5" />
                <span>Banjara Hills, Road No. 12, Hyderabad, Telangana 500034, India</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2.5 text-primary flex-shrink-0" />
                <span>+91 40 2345 6789 / +91 98765 43210</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2.5 text-primary flex-shrink-0" />
                <span>directorate@suffat.org</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2.5 text-primary flex-shrink-0" />
                <span>Mon – Sat: 08:00 AM – 05:00 PM IST</span>
              </div>
            </CardContent>
          </Card>

          <MapContainer
            latitude={17.4126}
            longitude={78.4398}
            branchName="Suffat-ul Huffaz HQ Banjara Hills"
          />
        </div>
      </div>
    </div>
  );
}

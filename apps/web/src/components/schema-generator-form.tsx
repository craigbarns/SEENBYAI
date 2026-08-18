"use client";

import { useState } from "react";
import { ArrowRight, Check, Copy, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const BUSINESS_TYPES = [
  { value: "LocalBusiness", label: "General Local Business" },
  { value: "Plumber", label: "Plumber / Plumbing Contractor" },
  { value: "Dentist", label: "Dentist / Dental Clinic" },
  { value: "Attorney", label: "Lawyer / Law Firm" },
  { value: "RealEstateAgent", label: "Real Estate Agent / Agency" },
  { value: "Restaurant", label: "Restaurant / Cafe" },
  { value: "HVACBusiness", label: "HVAC / AC & Heating Repair" },
  { value: "Electrician", label: "Electrician" },
  { value: "RoofingContractor", label: "Roofing Contractor" },
  { value: "AutoRepair", label: "Auto Repair / Mechanic" },
  { value: "AccountingService", label: "Accountant / CPA Firm" },
  { value: "MedicalClinic", label: "Medical Clinic / Doctor" },
];

export function SchemaGeneratorForm() {
  const [businessType, setBusinessType] = useState("Plumber");
  const [businessName, setBusinessName] = useState("Austin Premier Plumbing");
  const [url, setUrl] = useState("https://austinpremierplumbing.com");
  const [telephone, setTelephone] = useState("+1-512-555-0199");
  const [streetAddress, setStreetAddress] = useState("1204 Congress Ave");
  const [city, setCity] = useState("Austin");
  const [region, setRegion] = useState("TX");
  const [postalCode, setPostalCode] = useState("78701");
  const country = "US";
  const [priceRange, setPriceRange] = useState("$$");
  const [services, setServices] = useState("Emergency leak repair, Drain cleaning, Water heater replacement, Slab leak detection");
  const [copied, setCopied] = useState(false);

  const servicesArray = services
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const schemaJson = {
    "@context": "https://schema.org",
    "@type": businessType,
    name: businessName || "Your Business Name",
    url: url || "https://yourwebsite.com",
    telephone: telephone || "+1-555-000-0000",
    priceRange: priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: streetAddress,
      addressLocality: city,
      addressRegion: region,
      postalCode: postalCode,
      addressCountry: country,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${city}, ${region}`,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    ...(servicesArray.length > 0
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Services Offered",
            itemListElement: servicesArray.map((service) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: service,
              },
            })),
          },
        }
      : {}),
  };

  const codeSnippet = `<script type="application/ld+json">\n${JSON.stringify(schemaJson, null, 2)}\n</script>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Form Left Column */}
      <div className="rounded-3xl border border-foreground/10 bg-white p-6 shadow-sm lg:col-span-6 sm:p-8">
        <h2 className="text-xl font-extrabold tracking-tight">Enter Your Business Details</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill in the fields to generate valid schema for ChatGPT, Claude, and Perplexity.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Business Type / Industry
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-[#f8f8f3] px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
            >
              {BUSINESS_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Business Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-[#f8f8f3] px-3.5 py-2 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
                placeholder="e.g. Austin Premier Plumbing"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Website URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-[#f8f8f3] px-3.5 py-2 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Phone Number
              </label>
              <input
                type="text"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-[#f8f8f3] px-3.5 py-2 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
                placeholder="+1-512-555-0100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Price Range
              </label>
              <input
                type="text"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-[#f8f8f3] px-3.5 py-2 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
                placeholder="$, $$, or $$$"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Street Address
            </label>
            <input
              type="text"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-[#f8f8f3] px-3.5 py-2 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
              placeholder="1204 Congress Ave"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-[#f8f8f3] px-3.5 py-2 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
                placeholder="Austin"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                State / Region
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-[#f8f8f3] px-3.5 py-2 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
                placeholder="TX"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Zip Code
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-[#f8f8f3] px-3.5 py-2 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
                placeholder="78701"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Core Services (comma separated)
            </label>
            <textarea
              rows={2}
              value={services}
              onChange={(e) => setServices(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-[#f8f8f3] px-3.5 py-2 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
              placeholder="Emergency leak repair, Drain cleaning, Water heater replacement"
            />
          </div>
        </div>
      </div>

      {/* Code Snippet Right Column */}
      <div className="flex flex-col rounded-3xl border border-foreground/10 bg-[#173b35] p-6 text-white shadow-xl shadow-primary/15 lg:col-span-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-lime-300" />
            <h2 className="text-lg font-extrabold tracking-tight text-white">Generated JSON-LD Schema</h2>
          </div>
          <Button
            onClick={handleCopy}
            size="sm"
            className="rounded-full bg-lime-300 font-bold text-[#173b35] hover:bg-lime-200"
          >
            {copied ? (
              <>
                <Check className="mr-1.5 size-3.5" /> Copied!
              </>
            ) : (
              <>
                <Copy className="mr-1.5 size-3.5" /> Copy Code
              </>
            )}
          </Button>
        </div>

        <div className="mt-4 flex-1 overflow-auto rounded-2xl bg-black/40 p-4 font-mono text-xs text-lime-200/90">
          <pre className="whitespace-pre-wrap">{codeSnippet}</pre>
        </div>

        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="text-xs text-white/70">
            Paste this tag inside the <code className="rounded bg-white/10 px-1 py-0.5 text-lime-300">&lt;head&gt;</code> or <code className="rounded bg-white/10 px-1 py-0.5 text-lime-300">&lt;body&gt;</code> of your website homepage.
          </p>
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/10 p-4">
            <div>
              <p className="text-sm font-bold text-white">Want to test if AI engines see this?</p>
              <p className="text-xs text-white/60">Run a free AI visibility scan in 60 seconds.</p>
            </div>
            <Button asChild size="sm" className="rounded-full bg-lime-300 font-extrabold text-[#173b35] hover:bg-lime-200">
              <Link href="/onboarding">Scan Now <ArrowRight className="ml-1 size-3.5" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

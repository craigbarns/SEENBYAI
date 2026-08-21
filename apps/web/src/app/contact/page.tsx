"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  CircleAlert,
  FileChartColumnIncreasing,
  Loader2,
  MapPinned,
  MessagesSquare,
  ShieldCheck,
} from "lucide-react";

import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  fullName: string;
  workEmail: string;
  companyName: string;
  websiteUrl: string;
  locationCount: string;
  message: string;
  companyWebsite: string;
}

interface ContactResponse {
  status?: string;
  message?: string;
}

const initialFormData: FormData = {
  fullName: "",
  workEmail: "",
  companyName: "",
  websiteUrl: "",
  locationCount: "",
  message: "",
  companyWebsite: "",
};

function normalizeOptionalWebsite(value: string) {
  if (!value.trim()) return null;
  const candidate = /^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.target.id as keyof FormData;
    setFormData((current) => ({ ...current, [field]: event.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const normalizedUrl = normalizeOptionalWebsite(formData.websiteUrl);
    if (normalizedUrl === undefined) {
      setError("Please check the website address, for example agency.com.");
      return;
    }

    const locationCount = Number(formData.locationCount);
    if (!Number.isInteger(locationCount) || locationCount < 2 || locationCount > 10000) {
      setError("Please enter a number of locations between 2 and 10,000.");
      return;
    }

    setLoading(true);
    window.gtag?.("event", "agency_contact_submit", { location_count: locationCount });

    try {
      const trimmedEmail = formData.workEmail.trim();
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          fullName: formData.fullName.trim(),
          workEmail: trimmedEmail,
          companyName: formData.companyName.trim(),
          message: formData.message.trim() || null,
          websiteUrl: normalizedUrl,
          locationCount,
        }),
      });
      const data = (await response.json()) as ContactResponse;

      if (!response.ok || data.status !== "received") {
        throw new Error(data.message ?? "We couldn't send your request right now.");
      }

      window.gtag?.("event", "generate_lead", { lead_source: "agency_contact_form" });
      setSubmittedEmail(trimmedEmail);
      setFormData(initialFormData);
    } catch (submissionError) {
      window.gtag?.("event", "agency_contact_failed", { reason: "api_or_network" });
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something unexpected went wrong. Please try again in a moment.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-[#f8f8f3] lg:grid lg:grid-cols-[0.86fr_1.14fr]">
      <aside className="relative hidden min-h-screen overflow-hidden bg-[#173b35] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="pointer-events-none absolute -left-44 top-10 size-[430px] rounded-full bg-lime-300/12 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-44 -right-24 size-[500px] rounded-full bg-emerald-300/10 blur-3xl" aria-hidden="true" />

        <div className="relative">
          <Link className="inline-flex items-center gap-2.5" href="/" aria-label="GetInTheAnswer, back to home">
            <LogoMark variant="on-dark" className="size-10" />
            <span className="text-xl font-extrabold tracking-[-0.04em]">GetInTheAnswer</span>
          </Link>

          <div className="mt-16 max-w-lg xl:mt-20">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-lime-300">Agency &amp; Multi-location</p>
            <h1 className="mt-5 text-5xl font-extrabold leading-[1.02] tracking-[-0.05em] xl:text-6xl">
              Make every location visible in AI answers.
            </h1>
            <p className="mt-7 text-lg leading-8 text-white/65">
              Tell us what you manage. We&apos;ll recommend the right monitoring setup for your locations or client portfolio.
            </p>
          </div>
        </div>

        <div className="relative grid gap-3">
          {[
            { icon: MapPinned, text: "City-level visibility and competitor tracking" },
            { icon: FileChartColumnIncreasing, text: "White-label reports for clients and teams" },
            { icon: MessagesSquare, text: "A setup built around your portfolio" },
          ].map(({ icon: Icon, text }) => (
            <div className="flex items-center gap-3 text-sm font-semibold text-white/80" key={text}>
              <span className="flex size-8 items-center justify-center rounded-full bg-lime-300 text-[#173b35]">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              {text}
            </div>
          ))}
        </div>
      </aside>

      <section className="flex min-h-screen min-w-0 flex-col">
        <header className="flex h-[72px] items-center justify-between border-b border-foreground/8 px-5 sm:px-8 lg:px-10">
          <Link className="flex items-center gap-2 font-extrabold lg:hidden" href="/">
            <LogoMark className="size-9" />
            GetInTheAnswer
          </Link>
          <Link className="hidden items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground lg:flex" href="/">
            <ArrowLeft className="size-4" aria-hidden="true" /> Back to home
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <ShieldCheck className="size-3.5 text-emerald-700" aria-hidden="true" />
            Private request
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
          <div className="w-full max-w-2xl animate-fade-in">
            {submittedEmail ? (
              <div className="rounded-[1.75rem] border border-emerald-200 bg-white p-7 text-center shadow-sm sm:p-10" role="status" aria-live="polite">
                <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-lime-200 text-primary">
                  <CheckCircle2 className="size-8" aria-hidden="true" />
                </span>
                <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.14em] text-emerald-700">Request received</p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Thanks — your agency request is in.</h2>
                <p className="mx-auto mt-4 max-w-lg leading-7 text-muted-foreground">
                  We&apos;ll review your locations and reply to <span className="font-bold text-foreground">{submittedEmail}</span> with the right next step.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <Button asChild className="h-12 rounded-xl font-extrabold">
                    <Link href="/onboarding">Run a free scan <ArrowRight className="ml-2 size-4" aria-hidden="true" /></Link>
                  </Button>
                  <Button asChild variant="outline" className="h-12 rounded-xl bg-white font-bold">
                    <Link href="/">Back to home</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-4">
                  <span className="hidden size-12 shrink-0 items-center justify-center rounded-2xl bg-lime-200 text-primary sm:flex">
                    <Building2 className="size-6" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-emerald-700">Plan your rollout</p>
                    <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Tell us about your portfolio.</h2>
                    <p className="mt-2 text-base leading-7 text-muted-foreground">
                      Share the essentials and we&apos;ll help map the best way to monitor your locations.
                    </p>
                  </div>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit} data-testid="agency-contact-form">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="min-w-0 space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-bold">Your name</Label>
                      <Input id="fullName" autoComplete="name" placeholder="Jordan Lee" value={formData.fullName} onChange={handleChange} required minLength={2} maxLength={100} className="h-12 rounded-xl border-foreground/10 bg-white px-4 shadow-sm focus-visible:border-primary" />
                    </div>
                    <div className="min-w-0 space-y-2">
                      <Label htmlFor="workEmail" className="text-sm font-bold">Work email</Label>
                      <Input id="workEmail" type="email" autoComplete="email" inputMode="email" placeholder="jordan@agency.com" value={formData.workEmail} onChange={handleChange} required maxLength={200} className="h-12 rounded-xl border-foreground/10 bg-white px-4 shadow-sm focus-visible:border-primary" />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="min-w-0 space-y-2">
                      <Label htmlFor="companyName" className="text-sm font-bold">Company</Label>
                      <Input id="companyName" autoComplete="organization" placeholder="Northstar Agency" value={formData.companyName} onChange={handleChange} required minLength={2} maxLength={120} className="h-12 rounded-xl border-foreground/10 bg-white px-4 shadow-sm focus-visible:border-primary" />
                    </div>
                    <div className="min-w-0 space-y-2">
                      <Label htmlFor="locationCount" className="text-sm font-bold">Locations managed</Label>
                      <Input id="locationCount" type="number" inputMode="numeric" min={2} max={10000} step={1} placeholder="25" value={formData.locationCount} onChange={handleChange} required className="h-12 rounded-xl border-foreground/10 bg-white px-4 shadow-sm focus-visible:border-primary" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <Label htmlFor="websiteUrl" className="text-sm font-bold">Company website</Label>
                      <span className="text-xs font-medium text-muted-foreground">Optional</span>
                    </div>
                    <Input id="websiteUrl" autoComplete="url" inputMode="url" placeholder="northstaragency.com" value={formData.websiteUrl} onChange={handleChange} maxLength={300} className="h-12 rounded-xl border-foreground/10 bg-white px-4 shadow-sm focus-visible:border-primary" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <Label htmlFor="message" className="text-sm font-bold">Goals or context</Label>
                      <span className="text-xs font-medium text-muted-foreground">Optional</span>
                    </div>
                    <Textarea id="message" placeholder="Tell us about your locations, clients, reporting needs or timeline…" value={formData.message} onChange={handleChange} maxLength={2000} className="min-h-28 resize-y rounded-xl border-foreground/10 bg-white px-4 py-3 shadow-sm focus-visible:border-primary" />
                  </div>

                  <div className="absolute -left-[10000px] top-auto size-px overflow-hidden" aria-hidden="true">
                    <Label htmlFor="companyWebsite">Leave this field empty</Label>
                    <Input id="companyWebsite" tabIndex={-1} autoComplete="off" value={formData.companyWebsite} onChange={handleChange} />
                  </div>

                  {error && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm font-semibold text-red-800" role="alert" aria-live="polite">
                      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      {error}
                    </div>
                  )}

                  <Button className="h-14 w-full rounded-xl text-base font-extrabold shadow-lg shadow-primary/12" type="submit" disabled={loading}>
                    {loading ? <><Loader2 className="mr-2 size-5 animate-spin" aria-hidden="true" /> Sending your request…</> : <>Request an agency plan <ArrowRight className="ml-2 size-5" aria-hidden="true" /></>}
                  </Button>

                  <div className="flex items-start justify-center gap-2 text-center text-xs leading-5 text-muted-foreground">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-700" aria-hidden="true" />
                    <span>
                      We use these details only to review and respond to your request. We do not sell your data.{" "}
                      <Link className="font-bold text-emerald-700 underline" href="/privacy">Privacy details</Link>
                    </span>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

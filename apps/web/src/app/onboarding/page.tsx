"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  Loader2,
  LockKeyhole,
  ScanSearch,
  Sparkles,
} from "lucide-react";

import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  companyName: string;
  websiteUrl: string;
  city: string;
  industry: string;
  services: string;
}

interface OnboardingResponse {
  site_id?: string;
  message?: string;
}

const initialFormData: FormData = {
  companyName: "",
  websiteUrl: "",
  city: "",
  industry: "",
  services: "",
};

function normalizeWebsiteUrl(value: string) {
  const candidate = /^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`;

  try {
    return new URL(candidate).toString();
  } catch {
    return null;
  }
}

export default function OnboardingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.target.id as keyof FormData;
    setFormData((current) => ({ ...current, [field]: event.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const normalizedUrl = normalizeWebsiteUrl(formData.websiteUrl);
    if (!normalizedUrl) {
      setError("Please check your website address, for example my-business.com.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, websiteUrl: normalizedUrl }),
      });
      const data = (await response.json()) as OnboardingResponse;

      if (!response.ok || !data.site_id) {
        throw new Error(data.message ?? "We couldn't start the analysis right now.");
      }

      router.push(`/dashboard?site_id=${encodeURIComponent(data.site_id)}`);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something unexpected went wrong. Please try again in a moment.",
      );
      setLoading(false);
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-[#f8f8f3] lg:grid lg:grid-cols-[0.84fr_1.16fr]">
      <aside className="relative hidden min-h-screen overflow-hidden bg-[#173b35] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="pointer-events-none absolute -left-40 top-16 size-[430px] rounded-full bg-lime-300/12 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-44 -right-24 size-[500px] rounded-full bg-emerald-300/10 blur-3xl" aria-hidden="true" />

        <div className="relative">
          <Link className="inline-flex items-center gap-2.5" href="/" aria-label="LLM Rank, back to home">
            <LogoMark variant="on-dark" className="size-10" />
            <span className="text-xl font-extrabold tracking-[-0.04em]">LLM Rank</span>
          </Link>

          <div className="mt-20 max-w-lg">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-lime-300">Your audit starts here</p>
            <h1 className="mt-5 text-5xl font-extrabold leading-[1.02] tracking-[-0.05em] xl:text-6xl">
              Find out where AI engines rank your business.
            </h1>
            <p className="mt-7 text-lg leading-8 text-white/65">
              A few details are all it takes to build a query set tailored to your local market.
            </p>
          </div>
        </div>

        <div className="relative grid gap-3">
          {[
            "20 simulated customer questions",
            "ChatGPT, Claude and Perplexity compared",
            "Recommendations ranked by impact",
          ].map((benefit) => (
            <div className="flex items-center gap-3 text-sm font-semibold text-white/80" key={benefit}>
              <span className="flex size-6 items-center justify-center rounded-full bg-lime-300 text-[#173b35]">
                <Check className="size-3.5" aria-hidden="true" />
              </span>
              {benefit}
            </div>
          ))}
        </div>
      </aside>

      <section className="flex min-h-screen min-w-0 flex-col">
        <header className="flex h-[72px] items-center justify-between border-b border-foreground/8 px-5 sm:px-8 lg:px-10">
          <Link className="flex items-center gap-2 font-extrabold lg:hidden" href="/">
            <LogoMark className="size-9" />
            LLM Rank
          </Link>
          <Link className="hidden items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground lg:flex" href="/">
            <ArrowLeft className="size-4" aria-hidden="true" /> Back to home
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <LockKeyhole className="size-3.5 text-emerald-700" aria-hidden="true" />
            Secure connection
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
          <div className="w-full max-w-2xl animate-fade-in">
            <div className="mb-8 flex items-center gap-3" aria-label="Step 1 of 2">
              <span className="h-1.5 flex-1 rounded-full bg-primary" />
              <span className="h-1.5 flex-1 rounded-full bg-foreground/10" />
              <span className="ml-2 text-xs font-extrabold uppercase tracking-[0.12em] text-muted-foreground">1 / 2</span>
            </div>

            <div className="flex items-start gap-4">
              <span className="hidden size-12 shrink-0 items-center justify-center rounded-2xl bg-lime-200 text-primary sm:flex">
                <ScanSearch className="size-6" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-emerald-700">Business profile</p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Let&apos;s calibrate your analysis.</h2>
                <p className="mt-2 text-base leading-7 text-muted-foreground">Tell us about your core market. You&apos;ll be able to refine the queries in the report.</p>
              </div>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-sm font-bold">Business name</Label>
                <Input
                  id="companyName"
                  autoComplete="organization"
                  placeholder="Lakeside Kitchen Co."
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="h-12 rounded-xl border-foreground/10 bg-white px-4 shadow-sm focus-visible:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteUrl" className="text-sm font-bold">Main website</Label>
                <Input
                  id="websiteUrl"
                  autoComplete="url"
                  inputMode="url"
                  placeholder="lakesidekitchen.com"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  required
                  aria-describedby="website-help"
                  className="h-12 rounded-xl border-foreground/10 bg-white px-4 shadow-sm focus-visible:border-primary"
                />
                <p id="website-help" className="text-xs text-muted-foreground">With or without https://</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="min-w-0 space-y-2">
                  <Label htmlFor="city" className="text-sm font-bold">Primary city</Label>
                  <Input
                    id="city"
                    autoComplete="address-level2"
                    placeholder="Austin"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="h-12 rounded-xl border-foreground/10 bg-white px-4 shadow-sm focus-visible:border-primary"
                  />
                </div>
                <div className="min-w-0 space-y-2">
                  <Label htmlFor="industry" className="text-sm font-bold">Industry</Label>
                  <Input
                    id="industry"
                    placeholder="Kitchen remodeling"
                    value={formData.industry}
                    onChange={handleChange}
                    required
                    className="h-12 rounded-xl border-foreground/10 bg-white px-4 shadow-sm focus-visible:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline justify-between gap-3">
                  <Label htmlFor="services" className="text-sm font-bold">Main services</Label>
                  <span className="text-xs font-medium text-muted-foreground">Optional</span>
                </div>
                <Textarea
                  id="services"
                  placeholder="Custom kitchens, full remodels, cabinet design…"
                  value={formData.services}
                  onChange={handleChange}
                  className="min-h-24 resize-none rounded-xl border-foreground/10 bg-white px-4 py-3 shadow-sm focus-visible:border-primary"
                />
              </div>

              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm font-semibold text-red-800" role="alert" aria-live="polite">
                  <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  {error}
                </div>
              )}

              <Button className="h-14 w-full rounded-xl text-base font-extrabold shadow-lg shadow-primary/12" type="submit" disabled={loading}>
                {loading ? (
                  <><Loader2 className="mr-2 size-5 animate-spin" aria-hidden="true" /> Scanning AI engines… this can take up to a minute</>
                ) : (
                  <>Start my free analysis <ArrowRight className="ml-2 size-5" aria-hidden="true" /></>
                )}
              </Button>

              <p className="flex items-center justify-center gap-2 text-center text-xs leading-5 text-muted-foreground">
                <Sparkles className="size-3.5 shrink-0 text-emerald-700" aria-hidden="true" />
                Your information is only used to personalize this simulation.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Gauge,
  ListChecks,
  MessageSquareText,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Describe your business",
    description:
      "Your trade, your city and your services are all we need to generate the questions your prospects actually ask.",
  },
  {
    icon: MessageSquareText,
    number: "02",
    title: "We simulate the searches",
    description:
      "SeenByAI measures your mentions and your competitors' across ChatGPT, Claude and Perplexity.",
  },
  {
    icon: ListChecks,
    number: "03",
    title: "Take action",
    description:
      "You get concrete recommendations, ranked by priority and estimated impact.",
  },
];

const engines = [
  { name: "ChatGPT", mentions: 8, total: 10, color: "bg-emerald-400" },
  { name: "Perplexity", mentions: 6, total: 10, color: "bg-lime-400" },
  { name: "Claude", mentions: 5, total: 10, color: "bg-amber-300" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f8f3]">
      <header className="sticky top-0 z-50 border-b border-foreground/8 bg-[#f8f8f3]/88 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-5 sm:px-8 lg:px-10">
          <Link className="group flex items-center gap-2.5" href="/" aria-label="SeenByAI, home">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:-rotate-3">
              <Bot className="size-5" aria-hidden="true" />
            </span>
            <span className="text-xl font-extrabold tracking-[-0.04em]">SeenByAI</span>
          </Link>

          <nav className="ml-auto hidden items-center gap-7 md:flex" aria-label="Main navigation">
            <Link className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground" href="#method">
              How it works
            </Link>
            <Link className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground" href="#demo">
              Sample report
            </Link>
            <Link className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground" href="#pricing">
              Pricing
            </Link>
          </nav>

          <Button asChild className="ml-auto rounded-full px-5 md:ml-7">
            <Link href="/onboarding">
              <span className="hidden sm:inline">Analyze my business</span>
              <span className="sm:hidden">Analyze</span>
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </header>

      <main id="main-content">
        <section className="relative overflow-hidden border-b border-foreground/8">
          <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="pointer-events-none absolute -left-28 top-24 size-[420px] rounded-full bg-lime-200/35 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-32 top-8 size-[480px] rounded-full bg-emerald-200/30 blur-3xl" aria-hidden="true" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:py-24">
            <div className="max-w-2xl animate-fade-in-up">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-primary shadow-sm">
                <Sparkles className="size-3.5 text-lime-600" aria-hidden="true" />
                AI visibility for local businesses
              </div>

              <h1 className="text-balance text-[2.9rem] font-extrabold leading-[0.98] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-[4.6rem]">
                When your customers ask an AI,
                <span className="mt-2 block text-emerald-700">are you in the answer?</span>
              </h1>

              <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
                SeenByAI tests the queries that matter for your business, benchmarks your competitors and turns the results into concrete actions.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-14 rounded-full px-7 text-base shadow-lg shadow-primary/15">
                  <Link href="/onboarding">
                    Start my free analysis
                    <ArrowRight className="ml-2 size-5" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-14 rounded-full border-foreground/15 bg-white/60 px-7 text-base">
                  <Link href="#demo">Explore a report</Link>
                </Button>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" /> No credit card required</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" /> Instant results</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" /> Easy-to-read data</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-2xl animate-fade-in-up lg:mx-0" style={{ animationDelay: "120ms" }}>
              <div className="absolute -inset-5 -rotate-2 rounded-[2.25rem] bg-primary/8" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-[#173b35] p-3 shadow-2xl shadow-primary/20 sm:p-4">
                <div className="flex items-center justify-between px-3 py-2 text-primary-foreground/65">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <Bot className="size-4" aria-hidden="true" />
                    Visibility analysis
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="size-2 rounded-full bg-lime-300" />
                    Completed
                  </div>
                </div>

                <div className="mt-2 rounded-[1.35rem] bg-white p-4 sm:p-6">
                  <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Business analyzed</p>
                      <p className="mt-1 text-lg font-extrabold tracking-tight">Lakeside Kitchen Co. · Austin</p>
                    </div>
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                      <TrendingUp className="size-3.5" aria-hidden="true" />
                      +12 pts potential
                    </span>
                  </div>

                  <div className="grid gap-4 py-5 sm:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-2xl bg-[#f3f4ed] p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">AI Score</p>
                        <Gauge className="size-4 text-primary" aria-hidden="true" />
                      </div>
                      <div className="mt-4 flex items-end gap-1">
                        <span className="text-5xl font-black tracking-[-0.06em]">68</span>
                        <span className="pb-1.5 text-sm font-bold text-muted-foreground">/100</span>
                      </div>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                        <div className="h-full w-[68%] rounded-full bg-emerald-600" />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">Query tested</p>
                      <p className="mt-2 text-sm font-bold leading-5">&ldquo;Which contractor would you recommend to remodel a kitchen in Austin?&rdquo;</p>
                      <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="size-4" aria-hidden="true" />
                        Brand cited by 2 of 3 AIs
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {engines.map((engine) => (
                      <div className="min-w-0 rounded-xl bg-[#173b35] p-3 text-white" key={engine.name}>
                        <div className="mb-3 flex items-center gap-1.5 text-[10px] font-bold text-white/65 sm:text-xs">
                          <span className={`size-2 rounded-full ${engine.color}`} />
                          <span className="truncate">{engine.name}</span>
                        </div>
                        <p className="text-lg font-black sm:text-xl">{engine.mentions}<span className="text-xs font-semibold text-white/45">/{engine.total}</span></p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-3 hidden items-center gap-3 rounded-2xl border border-foreground/10 bg-white px-4 py-3 shadow-xl sm:flex">
                <span className="flex size-9 items-center justify-center rounded-xl bg-lime-100 text-primary">
                  <ListChecks className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Priority detected</p>
                  <p className="text-sm font-extrabold">Create a local FAQ page</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-foreground/8 bg-white" aria-label="Key benefits">
          <div className="mx-auto grid max-w-7xl divide-y divide-foreground/8 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-10">
            <div className="flex gap-4 py-7 sm:px-6 sm:first:pl-0">
              <BarChart3 className="mt-0.5 size-5 shrink-0 text-emerald-700" aria-hidden="true" />
              <div><p className="font-extrabold">A score you can understand</p><p className="mt-1 text-sm text-muted-foreground">Your position at a glance.</p></div>
            </div>
            <div className="flex gap-4 py-7 sm:px-6">
              <CircleDot className="mt-0.5 size-5 shrink-0 text-emerald-700" aria-hidden="true" />
              <div><p className="font-extrabold">Evidence, not hunches</p><p className="mt-1 text-sm text-muted-foreground">Every mention stays traceable.</p></div>
            </div>
            <div className="flex gap-4 py-7 sm:px-6 sm:last:pr-0">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-700" aria-hidden="true" />
              <div><p className="font-extrabold">Prioritized actions</p><p className="mt-1 text-sm text-muted-foreground">Start with what matters most.</p></div>
            </div>
          </div>
        </section>

        <section id="method" className="scroll-mt-24 bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="max-w-2xl">
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">Simple by design</p>
              <h2 className="mt-4 text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">From your website to an action plan in three steps.</h2>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {steps.map(({ icon: Icon, number, title, description }) => (
                <article className="group relative overflow-hidden rounded-3xl border border-foreground/10 bg-[#f8f8f3] p-7 transition-transform hover:-translate-y-1" key={number}>
                  <span className="absolute right-5 top-3 text-7xl font-black tracking-[-0.08em] text-primary/6">{number}</span>
                  <span className="relative flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="relative mt-8 text-xl font-extrabold tracking-tight">{title}</h3>
                  <p className="relative mt-3 leading-7 text-muted-foreground">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="demo" className="scroll-mt-20 overflow-hidden bg-[#173b35] py-20 text-white sm:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:px-10">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-lime-300">A report that leads somewhere</p>
              <h2 className="mt-4 text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">See what the AIs see. Fix what they miss.</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">
                The report connects every weakness it detects to an editorial or technical action, with a priority and an estimated impact.
              </p>
              <Button asChild size="lg" className="mt-8 h-13 rounded-full bg-lime-300 px-6 text-[#173b35] hover:bg-lime-200">
                <Link href="/onboarding">Create my first report <ArrowRight className="ml-2 size-5" aria-hidden="true" /></Link>
              </Button>
            </div>

            <div className="rounded-[1.75rem] border border-white/12 bg-white/7 p-3 backdrop-blur sm:p-5">
              <div className="rounded-[1.25rem] bg-[#f8f8f3] p-5 text-foreground sm:p-7">
                <div className="flex flex-col gap-4 border-b border-foreground/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-muted-foreground">Recommended action plan</p>
                    <h3 className="mt-1 text-2xl font-extrabold tracking-tight">3 high-impact opportunities</h3>
                  </div>
                  <span className="w-fit rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">High priority</span>
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    ["Create a local FAQ page", "Answer the 8 most frequent customer questions", "+8 pts"],
                    ["Structure your data", "Add LocalBusiness schema markup", "+3 pts"],
                    ["Strengthen your Services page", "Detail your service areas and specialties", "+1 pt"],
                  ].map(([title, detail, impact], index) => (
                    <div className="flex items-center gap-3 rounded-2xl border border-foreground/10 bg-white p-4" key={title}>
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground">{index + 1}</span>
                      <div className="min-w-0 flex-1"><p className="font-extrabold">{title}</p><p className="mt-0.5 text-sm text-muted-foreground">{detail}</p></div>
                      <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700 sm:block">{impact}</span>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-20 bg-[#f8f8f3] py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-emerald-700">Start risk-free</p>
            <h2 className="mt-4 text-balance text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">Your first scan is on us.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">Run the full analysis on your business before deciding to track your visibility over time.</p>

            <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-white text-left shadow-xl shadow-primary/5">
              <div className="grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">Discovery scan</p>
                  <div className="mt-2 flex items-end gap-2"><span className="text-5xl font-black tracking-[-0.06em]">$0</span><span className="pb-1.5 text-sm font-semibold text-muted-foreground">no credit card required</span></div>
                </div>
                <Button asChild size="lg" className="h-13 rounded-full px-6">
                  <Link href="/onboarding">Try it now <ArrowRight className="ml-2 size-4" aria-hidden="true" /></Link>
                </Button>
              </div>
              <div className="grid gap-3 border-t border-foreground/8 bg-[#f3f4ed] p-6 text-sm font-semibold sm:grid-cols-3 sm:p-8">
                {["20 simulated queries", "3 AI engines compared", "Full action plan"].map((item) => (
                  <span className="flex items-center gap-2" key={item}><Check className="size-4 text-emerald-700" aria-hidden="true" /> {item}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-foreground/8 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-9 sm:px-8 md:flex-row md:items-center lg:px-10">
          <Link className="flex items-center gap-2 font-extrabold" href="/" aria-label="SeenByAI, home">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Bot className="size-4" aria-hidden="true" /></span>
            SeenByAI
          </Link>
          <p className="text-sm text-muted-foreground md:ml-3">© 2026 SeenByAI. AI visibility, made actionable.</p>
          <nav className="flex gap-5 text-sm font-semibold text-muted-foreground md:ml-auto" aria-label="Footer navigation">
            <Link className="hover:text-foreground" href="#method">How it works</Link>
            <Link className="hover:text-foreground" href="#pricing">Pricing</Link>
            <Link className="hover:text-foreground" href="/onboarding">Run a scan</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

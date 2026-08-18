import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  FileText,
  Gauge,
  LockKeyhole,
  MapPin,
  MessageSquareText,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  XCircle,
} from "lucide-react";

import { LogoMark } from "@/components/logo";
import { UnlockButton } from "@/components/unlock-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { confirmCheckout, getDashboardData, type Priority } from "@/lib/seenbyai";

const PLAN_PRICE = "$29/mo";

function maskName(name: string) {
  const trimmed = name.trim();
  return trimmed.charAt(0) + "•".repeat(Math.min(10, Math.max(4, trimmed.length - 1)));
}

export const metadata: Metadata = {
  title: "AI Visibility Report",
  description: "Your visibility score, mentions and GetInTheAnswer action plan.",
  robots: {
    index: false,
    follow: false,
  },
};

const engineColors: Record<string, string> = {
  ChatGPT: "bg-emerald-500",
  Perplexity: "bg-lime-500",
  Claude: "bg-amber-400",
};

const priorityLabels: Record<Priority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const priorityStyles: Record<Priority, string> = {
  high: "border-red-200 bg-red-50 text-red-700",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  low: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

function getScoreSummary(score: number) {
  if (score >= 75) return { label: "Excellent visibility", copy: "Your brand is already well understood and frequently recommended." };
  if (score >= 50) return { label: "Room to grow", copy: "Your brand shows up, but several strategic queries are still up for grabs." };
  return { label: "Strong potential", copy: "AI engines still lack reliable signals to recommend your brand." };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ site_id?: string | string[]; session_id?: string | string[] }>;
}) {
  const params = await searchParams;
  const siteIdParam = params.site_id;
  const siteId = Array.isArray(siteIdParam) ? siteIdParam[0] : siteIdParam;
  const sessionIdParam = params.session_id;
  const sessionId = Array.isArray(sessionIdParam) ? sessionIdParam[0] : sessionIdParam;

  if (!siteId) redirect("/onboarding");

  if (sessionId) {
    await confirmCheckout(siteId, sessionId);
  }

  const data = await getDashboardData(siteId);

  if (!data) {
    return (
      <main id="main-content" className="flex min-h-screen items-center justify-center bg-[#f8f8f3] px-5 py-12">
        <div className="w-full max-w-lg rounded-[1.75rem] border border-foreground/10 bg-white p-7 text-center shadow-xl shadow-primary/5 sm:p-10">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
            <CircleAlert className="size-7" aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.04em]">Report unavailable</h1>
          <p className="mt-3 leading-7 text-muted-foreground">
            We can&apos;t retrieve this analysis. The link may have expired, or the service is temporarily unavailable.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="rounded-full"><a href={`/dashboard?site_id=${encodeURIComponent(siteId)}`}><RotateCcw className="mr-2 size-4" aria-hidden="true" /> Try again</a></Button>
            <Button asChild variant="outline" className="rounded-full"><Link href="/onboarding">New analysis</Link></Button>
          </div>
        </div>
      </main>
    );
  }

  const safeScore = Math.min(100, Math.max(0, data.visibility_score));
  const mentionRate = data.total_queries > 0 ? Math.round((data.brand_mentions / data.total_queries) * 100) : 0;
  const competitorGap = data.top_competitor_mentions - data.brand_mentions;
  const scoreSummary = getScoreSummary(safeScore);
  const engineNames = Array.from(new Set(data.queries.map((query) => query.engine)));
  const engineStats = engineNames.map((engine) => {
    const queries = data.queries.filter((query) => query.engine === engine);
    const mentions = queries.filter((query) => query.brand_mentioned).length;
    return { engine, mentions, total: queries.length, rate: queries.length ? Math.round((mentions / queries.length) * 100) : 0 };
  });

  return (
    <div className="min-h-screen bg-[#f8f8f3] pb-20">
      <header className="sticky top-0 z-50 border-b border-foreground/8 bg-[#f8f8f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-5 sm:px-8 lg:px-10">
          <Link className="flex items-center gap-2.5" href="/" aria-label="GetInTheAnswer, home">
            <LogoMark className="size-9" />
            <span className="text-xl font-extrabold tracking-[-0.04em]">GetInTheAnswer</span>
          </Link>
          {data?.mode === "live" ? (
            <Badge variant="outline" className="ml-auto border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-800">
              <Sparkles className="mr-1.5 size-3" aria-hidden="true" />
              <span className="hidden sm:inline">Live AI report</span><span className="sm:hidden">Live</span>
            </Badge>
          ) : (
            <Badge variant="outline" className="ml-auto border-amber-200 bg-amber-50 px-3 py-1.5 text-amber-800">
              <Sparkles className="mr-1.5 size-3" aria-hidden="true" />
              <span className="hidden sm:inline">Simulation report</span><span className="sm:hidden">Simulation</span>
            </Badge>
          )}
          <Button asChild variant="ghost" size="sm" className="ml-2 hidden rounded-full sm:inline-flex">
            <Link href="/onboarding"><RotateCcw className="mr-2 size-4" aria-hidden="true" /> New scan</Link>
          </Button>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-muted-foreground">
          <Link className="flex items-center gap-1.5 transition-colors hover:text-foreground" href="/">
            <ArrowLeft className="size-4" aria-hidden="true" /> Home
          </Link>
          <span className="text-foreground/20">/</span>
          <span className="text-foreground">Report for {data.company_name}</span>
        </div>

        <section className="relative overflow-hidden rounded-[2rem] bg-[#173b35] p-6 text-white shadow-xl shadow-primary/10 sm:p-9 lg:p-10">
          <div className="pointer-events-none absolute -right-24 -top-32 size-96 rounded-full bg-lime-300/12 blur-3xl" aria-hidden="true" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-0 bg-lime-300 text-[#173b35] hover:bg-lime-300"><Check className="mr-1 size-3" aria-hidden="true" /> Analysis complete</Badge>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-white/55"><MapPin className="size-3.5" aria-hidden="true" /> {data.city} · {data.industry}</span>
              </div>
              <h1 className="mt-5 text-balance text-3xl font-extrabold tracking-[-0.045em] sm:text-5xl">Here&apos;s how AI engines see {data.company_name}.</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
                {data.mode === "live"
                  ? `Report based on ${data.total_queries} real local searches asked to AI engines.`
                  : `Report based on ${data.total_queries} simulated local searches across ChatGPT, Claude and Perplexity.`}
              </p>
              <a className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-lime-300 hover:text-lime-200" href={data.website_url} target="_blank" rel="noreferrer">
                {data.website_url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/7 p-5 text-center backdrop-blur sm:flex-row sm:gap-5 sm:p-4 sm:pr-6 sm:text-left">
              <div className="flex size-28 shrink-0 items-center justify-center rounded-full p-2" style={{ background: `conic-gradient(#bef264 ${safeScore * 3.6}deg, rgba(255,255,255,.12) 0deg)` }} aria-label={`Visibility score ${safeScore} out of 100`}>
                <div className="flex size-full flex-col items-center justify-center rounded-full bg-[#173b35]">
                  <span className="text-4xl font-black tracking-[-0.06em]">{safeScore}</span>
                  <span className="text-[11px] font-bold text-white/45">OUT OF 100</span>
                </div>
              </div>
              <div className="max-w-56 sm:max-w-40">
                <p className="font-extrabold text-lime-300">{scoreSummary.label}</p>
                <p className="mt-2 text-sm leading-5 text-white/55">{scoreSummary.copy}</p>
              </div>
            </div>
          </div>
        </section>

        {!data.unlocked && (
          <section className="flex flex-col items-start justify-between gap-4 rounded-[1.75rem] border-2 border-dashed border-primary/25 bg-white p-6 sm:flex-row sm:items-center sm:p-7">
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-lime-200 text-primary">
                <LockKeyhole className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xl font-extrabold tracking-[-0.03em]">This is a preview of your report</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">Unlock every competitor name, all {data.total_queries} queries and your full action plan. Cancel anytime.</p>
              </div>
            </div>
            <UnlockButton siteId={data.site_id} className="h-12 shrink-0 rounded-full px-6 font-extrabold">Unlock full report — {PLAN_PRICE}</UnlockButton>
          </section>
        )}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Key metrics">
          <Card className="border-foreground/8 bg-white py-0 shadow-sm"><CardContent className="p-5 sm:p-6"><div className="flex items-center justify-between"><span className="text-sm font-bold text-muted-foreground">Mentions</span><Target className="size-5 text-emerald-700" aria-hidden="true" /></div><p className="mt-4 text-4xl font-black tracking-[-0.05em]">{data.brand_mentions}<span className="text-base font-bold text-muted-foreground">/{data.total_queries}</span></p><p className="mt-2 text-sm text-muted-foreground">Your brand is cited in {mentionRate}% of tests.</p></CardContent></Card>
          <Card className="border-foreground/8 bg-white py-0 shadow-sm"><CardContent className="p-5 sm:p-6"><div className="flex items-center justify-between"><span className="text-sm font-bold text-muted-foreground">Leading competitor</span><Trophy className="size-5 text-amber-500" aria-hidden="true" /></div><p className="mt-4 truncate text-2xl font-black tracking-[-0.04em]">{data.top_competitor}</p><p className="mt-2 text-sm text-muted-foreground">{data.top_competitor_mentions} mentions detected.</p></CardContent></Card>
          <Card className="border-foreground/8 bg-white py-0 shadow-sm"><CardContent className="p-5 sm:p-6"><div className="flex items-center justify-between"><span className="text-sm font-bold text-muted-foreground">Competitive gap</span><TrendingUp className="size-5 text-primary" aria-hidden="true" /></div><p className="mt-4 text-4xl font-black tracking-[-0.05em]">{competitorGap > 0 ? `-${competitorGap}` : `+${Math.abs(competitorGap)}`}</p><p className="mt-2 text-sm text-muted-foreground">{competitorGap > 0 ? "mentions behind" : "mentions ahead of"} the leader.</p></CardContent></Card>
          <Card className="border-foreground/8 bg-lime-200 py-0 shadow-sm"><CardContent className="p-5 sm:p-6"><div className="flex items-center justify-between"><span className="text-sm font-bold text-primary/70">Priority actions</span><FileText className="size-5 text-primary" aria-hidden="true" /></div><p className="mt-4 text-4xl font-black tracking-[-0.05em]">{data.recommendations.length}</p><p className="mt-2 text-sm text-primary/70">Your roadmap is ready.</p></CardContent></Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="rounded-[1.75rem] border border-foreground/8 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">Coverage by engine</p><h2 className="mt-2 text-2xl font-extrabold tracking-[-0.035em]">Where are you visible?</h2></div>
              <Gauge className="size-5 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="mt-7 space-y-6">
              {engineStats.map(({ engine, mentions, total, rate }) => (
                <div key={engine}>
                  <div className="mb-2 flex items-center justify-between text-sm"><span className="flex items-center gap-2 font-extrabold"><span className={`size-2.5 rounded-full ${engineColors[engine]}`} />{engine}</span><span className="font-bold text-muted-foreground">{mentions}/{total} · {rate}%</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-foreground/7"><div className={`h-full rounded-full ${engineColors[engine]}`} style={{ width: `${rate}%` }} /></div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-foreground/8 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">Quick read</p><h2 className="mt-2 text-2xl font-extrabold tracking-[-0.035em]">What this scan reveals</h2></div>
              <MessageSquareText className="size-5 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {data.brand_mentions > 0 ? (
                <div className="rounded-2xl bg-emerald-50 p-4"><div className="flex items-center gap-2 font-extrabold text-emerald-800"><CheckCircle2 className="size-4" aria-hidden="true" /> Positive signal</div><p className="mt-2 text-sm leading-6 text-emerald-900/70">Your brand is already recognized on {data.brand_mentions} relevant queries.</p></div>
              ) : (
                <div className="rounded-2xl bg-slate-100 p-4"><div className="flex items-center gap-2 font-extrabold text-slate-700"><CircleAlert className="size-4" aria-hidden="true" /> No mentions yet</div><p className="mt-2 text-sm leading-6 text-slate-600">AI engines never cited your brand in this scan. The action plan below is designed to change that.</p></div>
              )}
              <div className="rounded-2xl bg-amber-50 p-4"><div className="flex items-center gap-2 font-extrabold text-amber-800"><AlertTriangle className="size-4" aria-hidden="true" /> Opportunity</div><p className="mt-2 text-sm leading-6 text-amber-900/70">{Math.max(0, data.total_queries - data.brand_mentions)} queries don&apos;t mention your business yet.</p></div>
            </div>
          </div>
        </section>

        {data.unlocked && data.history.length > 1 && (
          <section className="rounded-[1.75rem] border border-foreground/8 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">Weekly tracking</p><h2 className="mt-2 text-2xl font-extrabold tracking-[-0.035em]">Score history</h2></div>
              <TrendingUp className="size-5 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="mt-7 flex items-end gap-3 overflow-x-auto pb-2" aria-label="Visibility score over time">
              {data.history.map((point, index) => (
                <div className="flex min-w-14 flex-col items-center gap-2" key={`${point.date}-${index}`}>
                  <span className="text-sm font-extrabold tabular-nums">{point.score}</span>
                  <div className="flex h-28 w-9 items-end overflow-hidden rounded-lg bg-foreground/6">
                    <div className="w-full rounded-lg bg-emerald-600" style={{ height: `${Math.max(4, point.score)}%` }} />
                  </div>
                  <span className="text-[11px] font-bold text-muted-foreground">{point.date.slice(5)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">Action plan</p><h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em]">Your next moves</h2><p className="mt-2 text-muted-foreground">Ranked by urgency and estimated impact.</p></div>
            <Badge variant="outline" className="w-fit bg-white px-3 py-1.5">{data.recommendations.length} recommendations</Badge>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {data.recommendations.map((recommendation, index) =>
              data.unlocked ? (
                <article className="flex flex-col rounded-[1.5rem] border border-foreground/8 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1" key={recommendation.title}>
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground">{index + 1}</span>
                    <Badge variant="outline" className={priorityStyles[recommendation.priority]}>{priorityLabels[recommendation.priority]} priority</Badge>
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold tracking-[-0.025em]">{recommendation.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{recommendation.description}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-foreground/8 pt-4 text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground"><span>Estimated impact</span><span className="text-emerald-700">{recommendation.estimated_impact}</span></div>
                </article>
              ) : (
                <article className="flex flex-col rounded-[1.5rem] border border-dashed border-foreground/15 bg-white/60 p-6" key={`locked-${index}`}>
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-foreground/8 text-sm font-black text-muted-foreground">{index + 1}</span>
                    <Badge variant="outline" className="border-foreground/15 bg-white text-muted-foreground"><LockKeyhole className="mr-1 size-3" aria-hidden="true" /> Locked</Badge>
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold tracking-[-0.025em] text-muted-foreground">Recommendation #{index + 1}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">Unlock the full report to reveal this action, its priority and its expected impact on your AI visibility.</p>
                  <div className="mt-6 border-t border-foreground/8 pt-4">
                    <UnlockButton siteId={data.site_id} size="sm" variant="outline" className="w-full rounded-full">Unlock — {PLAN_PRICE}</UnlockButton>
                  </div>
                </article>
              ),
            )}
          </div>
        </section>

        <section className="pt-4">
          <div><p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">Scan data</p><h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em]">{data.mode === "live" ? "Scan details" : "Simulation details"}</h2><p className="mt-2 text-muted-foreground">The queries used to calculate your score.</p></div>
          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-foreground/8 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <Table className="min-w-[900px]">
                <TableHeader className="bg-[#f3f4ed]"><TableRow className="hover:bg-transparent"><TableHead className="w-[390px] px-6 py-4 font-extrabold text-foreground">Query tested</TableHead><TableHead className="font-extrabold text-foreground">Engine</TableHead><TableHead className="text-center font-extrabold text-foreground">Mention</TableHead><TableHead className="font-extrabold text-foreground">Competitors cited</TableHead><TableHead className="pr-6 text-right font-extrabold text-foreground">Confidence</TableHead></TableRow></TableHeader>
                <TableBody>
                  {(data.unlocked ? data.queries : data.queries.slice(0, 3)).map((query, index) => (
                    <TableRow className="hover:bg-[#f8f8f3]" key={`${query.engine}-${query.query}-${index}`}>
                      <TableCell className="px-6 py-4 font-semibold leading-6">
                        {query.query}
                        {data.unlocked && query.answer_excerpt && (
                          <details className="group mt-2">
                            <summary className="flex cursor-pointer list-none items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 [&::-webkit-details-marker]:hidden">
                              <ChevronRight className="size-3 transition-transform group-open:rotate-90" aria-hidden="true" />
                              What {query.engine} actually said
                            </summary>
                            <blockquote className="mt-2 rounded-xl border-l-2 border-emerald-600 bg-[#f8f8f3] p-3 text-xs font-normal italic leading-5 text-muted-foreground">
                              “{query.answer_excerpt}”
                            </blockquote>
                          </details>
                        )}
                      </TableCell>
                      <TableCell><Badge variant="outline" className="bg-white"><span className={`mr-2 size-2 rounded-full ${engineColors[query.engine] ?? "bg-slate-400"}`} />{query.engine}</Badge></TableCell>
                      <TableCell className="text-center">{query.brand_mentioned ? <span className="inline-flex size-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600" aria-label="Brand mentioned"><CheckCircle2 className="size-5" aria-hidden="true" /></span> : <span className="inline-flex size-8 items-center justify-center rounded-full bg-red-50 text-red-500" aria-label="Brand not mentioned"><XCircle className="size-5" aria-hidden="true" /></span>}</TableCell>
                      <TableCell>{query.competitors_detected.length ? <div className="flex flex-wrap gap-1.5">{query.competitors_detected.map((competitor) => data.unlocked || competitor === data.top_competitor ? <span className="rounded-md border border-amber-100 bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800" key={competitor}>{competitor}</span> : <span className="inline-flex items-center gap-1 rounded-md border border-foreground/10 bg-foreground/5 px-2 py-1 text-xs font-bold text-muted-foreground" key={competitor}><LockKeyhole className="size-3" aria-hidden="true" />{maskName(competitor)}</span>)}</div> : <span className="text-sm italic text-muted-foreground">None</span>}</TableCell>
                      <TableCell className="pr-6 text-right font-extrabold tabular-nums">{Math.round(query.confidence * 100)}%</TableCell>
                    </TableRow>
                  ))}
                  {!data.unlocked && data.queries.length > 3 && (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={5} className="p-0">
                        <div className="flex flex-col items-center justify-center gap-3 bg-[#f8f8f3] px-6 py-8 sm:flex-row sm:gap-5">
                          <span className="flex items-center gap-2 font-bold text-muted-foreground"><LockKeyhole className="size-4" aria-hidden="true" /> {data.queries.length - 3} more queries — plus what each AI actually said — are hidden in the preview</span>
                          <UnlockButton siteId={data.site_id} size="sm" className="rounded-full px-5">Unlock full report — {PLAN_PRICE}</UnlockButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        <section className="flex flex-col items-start justify-between gap-5 rounded-[1.75rem] bg-lime-200 p-6 sm:flex-row sm:items-center sm:p-8">
          <div><h2 className="text-2xl font-extrabold tracking-[-0.035em]">Want to measure another business?</h2><p className="mt-1 text-sm text-primary/70">Create a new report in minutes.</p></div>
          <Button asChild className="rounded-full"><Link href="/onboarding">Run a new scan <ArrowRight className="ml-2 size-4" aria-hidden="true" /></Link></Button>
        </section>
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  FileText,
  Gauge,
  MapPin,
  MessageSquareText,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDashboardData, type Priority } from "@/lib/seenbyai";

export const metadata: Metadata = {
  title: "Rapport de visibilité IA",
  description: "Votre score de visibilité, vos mentions et votre plan d’action SeenByAI.",
};

const engineColors: Record<string, string> = {
  ChatGPT: "bg-emerald-500",
  Perplexity: "bg-lime-500",
  Claude: "bg-amber-400",
};

const priorityLabels: Record<Priority, string> = {
  high: "Haute",
  medium: "Moyenne",
  low: "Basse",
};

const priorityStyles: Record<Priority, string> = {
  high: "border-red-200 bg-red-50 text-red-700",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  low: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

function getScoreSummary(score: number) {
  if (score >= 75) return { label: "Excellente visibilité", copy: "Votre marque est déjà bien comprise et fréquemment recommandée." };
  if (score >= 50) return { label: "Visibilité à renforcer", copy: "Votre marque apparaît, mais plusieurs requêtes stratégiques restent à conquérir." };
  return { label: "Fort potentiel", copy: "Les IA manquent encore de signaux fiables pour recommander votre marque." };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ site_id?: string | string[] }>;
}) {
  const siteIdParam = (await searchParams).site_id;
  const siteId = Array.isArray(siteIdParam) ? siteIdParam[0] : siteIdParam;

  if (!siteId) redirect("/onboarding");

  const data = await getDashboardData(siteId);

  if (!data) {
    return (
      <main id="main-content" className="flex min-h-screen items-center justify-center bg-[#f8f8f3] px-5 py-12">
        <div className="w-full max-w-lg rounded-[1.75rem] border border-foreground/10 bg-white p-7 text-center shadow-xl shadow-primary/5 sm:p-10">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
            <CircleAlert className="size-7" aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.04em]">Rapport indisponible</h1>
          <p className="mt-3 leading-7 text-muted-foreground">
            Nous ne parvenons pas à récupérer cette analyse. Le lien a peut-être expiré ou le service est momentanément indisponible.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="rounded-full"><a href={`/dashboard?site_id=${encodeURIComponent(siteId)}`}><RotateCcw className="mr-2 size-4" aria-hidden="true" /> Réessayer</a></Button>
            <Button asChild variant="outline" className="rounded-full"><Link href="/onboarding">Nouvelle analyse</Link></Button>
          </div>
        </div>
      </main>
    );
  }

  const safeScore = Math.min(100, Math.max(0, data.visibility_score));
  const mentionRate = data.total_queries > 0 ? Math.round((data.brand_mentions / data.total_queries) * 100) : 0;
  const competitorGap = data.top_competitor_mentions - data.brand_mentions;
  const scoreSummary = getScoreSummary(safeScore);
  const engineStats = ["ChatGPT", "Perplexity", "Claude"].map((engine) => {
    const queries = data.queries.filter((query) => query.engine === engine);
    const mentions = queries.filter((query) => query.brand_mentioned).length;
    return { engine, mentions, total: queries.length, rate: queries.length ? Math.round((mentions / queries.length) * 100) : 0 };
  });

  return (
    <div className="min-h-screen bg-[#f8f8f3] pb-20">
      <header className="sticky top-0 z-50 border-b border-foreground/8 bg-[#f8f8f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-5 sm:px-8 lg:px-10">
          <Link className="flex items-center gap-2.5" href="/" aria-label="SeenByAI, accueil">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Bot className="size-5" aria-hidden="true" />
            </span>
            <span className="text-xl font-extrabold tracking-[-0.04em]">SeenByAI</span>
          </Link>
          <Badge variant="outline" className="ml-auto border-amber-200 bg-amber-50 px-3 py-1.5 text-amber-800">
            <Sparkles className="mr-1.5 size-3" aria-hidden="true" />
            <span className="hidden sm:inline">Rapport de simulation</span><span className="sm:hidden">Simulation</span>
          </Badge>
          <Button asChild variant="ghost" size="sm" className="ml-2 hidden rounded-full sm:inline-flex">
            <Link href="/onboarding"><RotateCcw className="mr-2 size-4" aria-hidden="true" /> Nouveau scan</Link>
          </Button>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-muted-foreground">
          <Link className="flex items-center gap-1.5 transition-colors hover:text-foreground" href="/">
            <ArrowLeft className="size-4" aria-hidden="true" /> Accueil
          </Link>
          <span className="text-foreground/20">/</span>
          <span className="text-foreground">Rapport de {data.company_name}</span>
        </div>

        <section className="relative overflow-hidden rounded-[2rem] bg-[#173b35] p-6 text-white shadow-xl shadow-primary/10 sm:p-9 lg:p-10">
          <div className="pointer-events-none absolute -right-24 -top-32 size-96 rounded-full bg-lime-300/12 blur-3xl" aria-hidden="true" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-0 bg-lime-300 text-[#173b35] hover:bg-lime-300"><Check className="mr-1 size-3" aria-hidden="true" /> Analyse terminée</Badge>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-white/55"><MapPin className="size-3.5" aria-hidden="true" /> {data.city} · {data.industry}</span>
              </div>
              <h1 className="mt-5 text-balance text-3xl font-extrabold tracking-[-0.045em] sm:text-5xl">Voici comment les IA voient {data.company_name}.</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
                Rapport basé sur {data.total_queries} recherches locales simulées dans ChatGPT, Claude et Perplexity.
              </p>
              <a className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-lime-300 hover:text-lime-200" href={data.website_url} target="_blank" rel="noreferrer">
                {data.website_url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/7 p-5 text-center backdrop-blur sm:flex-row sm:gap-5 sm:p-4 sm:pr-6 sm:text-left">
              <div className="flex size-28 shrink-0 items-center justify-center rounded-full p-2" style={{ background: `conic-gradient(#bef264 ${safeScore * 3.6}deg, rgba(255,255,255,.12) 0deg)` }} aria-label={`Score de visibilité ${safeScore} sur 100`}>
                <div className="flex size-full flex-col items-center justify-center rounded-full bg-[#173b35]">
                  <span className="text-4xl font-black tracking-[-0.06em]">{safeScore}</span>
                  <span className="text-[11px] font-bold text-white/45">SUR 100</span>
                </div>
              </div>
              <div className="max-w-56 sm:max-w-40">
                <p className="font-extrabold text-lime-300">{scoreSummary.label}</p>
                <p className="mt-2 text-sm leading-5 text-white/55">{scoreSummary.copy}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Indicateurs principaux">
          <Card className="border-foreground/8 bg-white py-0 shadow-sm"><CardContent className="p-5 sm:p-6"><div className="flex items-center justify-between"><span className="text-sm font-bold text-muted-foreground">Mentions</span><Target className="size-5 text-emerald-700" aria-hidden="true" /></div><p className="mt-4 text-4xl font-black tracking-[-0.05em]">{data.brand_mentions}<span className="text-base font-bold text-muted-foreground">/{data.total_queries}</span></p><p className="mt-2 text-sm text-muted-foreground">Votre marque est citée dans {mentionRate}% des tests.</p></CardContent></Card>
          <Card className="border-foreground/8 bg-white py-0 shadow-sm"><CardContent className="p-5 sm:p-6"><div className="flex items-center justify-between"><span className="text-sm font-bold text-muted-foreground">Concurrent dominant</span><Trophy className="size-5 text-amber-500" aria-hidden="true" /></div><p className="mt-4 truncate text-2xl font-black tracking-[-0.04em]">{data.top_competitor}</p><p className="mt-2 text-sm text-muted-foreground">{data.top_competitor_mentions} mentions détectées.</p></CardContent></Card>
          <Card className="border-foreground/8 bg-white py-0 shadow-sm"><CardContent className="p-5 sm:p-6"><div className="flex items-center justify-between"><span className="text-sm font-bold text-muted-foreground">Écart concurrentiel</span><TrendingUp className="size-5 text-primary" aria-hidden="true" /></div><p className="mt-4 text-4xl font-black tracking-[-0.05em]">{competitorGap > 0 ? `-${competitorGap}` : `+${Math.abs(competitorGap)}`}</p><p className="mt-2 text-sm text-muted-foreground">{competitorGap > 0 ? "mentions à rattraper" : "mentions d’avance"} sur le leader.</p></CardContent></Card>
          <Card className="border-foreground/8 bg-lime-200 py-0 shadow-sm"><CardContent className="p-5 sm:p-6"><div className="flex items-center justify-between"><span className="text-sm font-bold text-primary/70">Actions prioritaires</span><FileText className="size-5 text-primary" aria-hidden="true" /></div><p className="mt-4 text-4xl font-black tracking-[-0.05em]">{data.recommendations.length}</p><p className="mt-2 text-sm text-primary/70">Votre feuille de route est prête.</p></CardContent></Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="rounded-[1.75rem] border border-foreground/8 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">Couverture par moteur</p><h2 className="mt-2 text-2xl font-extrabold tracking-[-0.035em]">Où êtes-vous visible&nbsp;?</h2></div>
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
              <div><p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">Lecture rapide</p><h2 className="mt-2 text-2xl font-extrabold tracking-[-0.035em]">Ce que révèle ce scan</h2></div>
              <MessageSquareText className="size-5 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-emerald-50 p-4"><div className="flex items-center gap-2 font-extrabold text-emerald-800"><CheckCircle2 className="size-4" aria-hidden="true" /> Signal positif</div><p className="mt-2 text-sm leading-6 text-emerald-900/70">Votre marque est déjà comprise sur {data.brand_mentions} requêtes pertinentes.</p></div>
              <div className="rounded-2xl bg-amber-50 p-4"><div className="flex items-center gap-2 font-extrabold text-amber-800"><AlertTriangle className="size-4" aria-hidden="true" /> Opportunité</div><p className="mt-2 text-sm leading-6 text-amber-900/70">{Math.max(0, data.total_queries - data.brand_mentions)} requêtes ne citent pas encore votre entreprise.</p></div>
            </div>
          </div>
        </section>

        <section className="pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">Plan d’action</p><h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em]">Les prochaines actions à mener</h2><p className="mt-2 text-muted-foreground">Classées selon leur urgence et leur impact estimé.</p></div>
            <Badge variant="outline" className="w-fit bg-white px-3 py-1.5">{data.recommendations.length} recommandations</Badge>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {data.recommendations.map((recommendation, index) => (
              <article className="flex flex-col rounded-[1.5rem] border border-foreground/8 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1" key={recommendation.title}>
                <div className="flex items-start justify-between gap-4">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground">{index + 1}</span>
                  <Badge variant="outline" className={priorityStyles[recommendation.priority]}>Priorité {priorityLabels[recommendation.priority].toLowerCase()}</Badge>
                </div>
                <h3 className="mt-6 text-xl font-extrabold tracking-[-0.025em]">{recommendation.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{recommendation.description}</p>
                <div className="mt-6 flex items-center justify-between border-t border-foreground/8 pt-4 text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground"><span>Impact estimé</span><span className="text-emerald-700">{recommendation.estimated_impact}</span></div>
              </article>
            ))}
          </div>
        </section>

        <section className="pt-4">
          <div><p className="text-sm font-extrabold uppercase tracking-[0.12em] text-emerald-700">Données du scan</p><h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em]">Détail des simulations</h2><p className="mt-2 text-muted-foreground">Les requêtes utilisées pour calculer votre score.</p></div>
          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-foreground/8 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <Table className="min-w-[900px]">
                <TableHeader className="bg-[#f3f4ed]"><TableRow className="hover:bg-transparent"><TableHead className="w-[390px] px-6 py-4 font-extrabold text-foreground">Requête testée</TableHead><TableHead className="font-extrabold text-foreground">Moteur</TableHead><TableHead className="text-center font-extrabold text-foreground">Mention</TableHead><TableHead className="font-extrabold text-foreground">Concurrents cités</TableHead><TableHead className="pr-6 text-right font-extrabold text-foreground">Confiance</TableHead></TableRow></TableHeader>
                <TableBody>
                  {data.queries.map((query, index) => (
                    <TableRow className="hover:bg-[#f8f8f3]" key={`${query.engine}-${query.query}-${index}`}>
                      <TableCell className="px-6 py-4 font-semibold leading-6">{query.query}</TableCell>
                      <TableCell><Badge variant="outline" className="bg-white"><span className={`mr-2 size-2 rounded-full ${engineColors[query.engine] ?? "bg-slate-400"}`} />{query.engine}</Badge></TableCell>
                      <TableCell className="text-center">{query.brand_mentioned ? <span className="inline-flex size-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600" aria-label="Marque mentionnée"><CheckCircle2 className="size-5" aria-hidden="true" /></span> : <span className="inline-flex size-8 items-center justify-center rounded-full bg-red-50 text-red-500" aria-label="Marque non mentionnée"><XCircle className="size-5" aria-hidden="true" /></span>}</TableCell>
                      <TableCell>{query.competitors_detected.length ? <div className="flex flex-wrap gap-1.5">{query.competitors_detected.map((competitor) => <span className="rounded-md border border-amber-100 bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800" key={competitor}>{competitor}</span>)}</div> : <span className="text-sm italic text-muted-foreground">Aucun</span>}</TableCell>
                      <TableCell className="pr-6 text-right font-extrabold tabular-nums">{Math.round(query.confidence * 100)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        <section className="flex flex-col items-start justify-between gap-5 rounded-[1.75rem] bg-lime-200 p-6 sm:flex-row sm:items-center sm:p-8">
          <div><h2 className="text-2xl font-extrabold tracking-[-0.035em]">Vous voulez mesurer une autre entreprise&nbsp;?</h2><p className="mt-1 text-sm text-primary/70">Créez un nouveau rapport en quelques minutes.</p></div>
          <Button asChild className="rounded-full"><Link href="/onboarding">Lancer un nouveau scan <ArrowRight className="ml-2 size-4" aria-hidden="true" /></Link></Button>
        </section>
      </main>
    </div>
  );
}

import asyncio
import json
import os
import random
import re
import unicodedata
import uuid
from collections import Counter
from typing import List, Optional

import stripe
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import AnyHttpUrl, BaseModel, Field
from sqlalchemy import create_engine, text

from site_audit import SiteAudit, audit_site

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "").strip()
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "").strip()
ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-haiku-4-5")
PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY", "").strip()
PERPLEXITY_MODEL = os.getenv("PERPLEXITY_MODEL", "sonar")
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "").strip()
STRIPE_PRICE_ID = os.getenv("STRIPE_PRICE_ID", "").strip()
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://getintheanswer.com").rstrip("/")
LIVE_MODE = bool(OPENAI_API_KEY)
BILLING_ENABLED = bool(STRIPE_SECRET_KEY and STRIPE_PRICE_ID)

if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY

app = FastAPI(
    title="GetInTheAnswer API",
    description="Backend API for GetInTheAnswer — AI visibility scans for local businesses",
    version="2.0.0",
)

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

db_engine = create_engine(DATABASE_URL, pool_pre_ping=True) if DATABASE_URL else None


@app.on_event("startup")
def init_db() -> None:
    if db_engine is None:
        return
    with db_engine.begin() as conn:
        conn.execute(
            text(
                "CREATE TABLE IF NOT EXISTS reports ("
                "site_id UUID PRIMARY KEY, "
                "payload JSONB NOT NULL, "
                "created_at TIMESTAMPTZ DEFAULT now())"
            )
        )
        conn.execute(text("ALTER TABLE reports ADD COLUMN IF NOT EXISTS email TEXT"))
        conn.execute(text("ALTER TABLE reports ADD COLUMN IF NOT EXISTS unlocked BOOLEAN NOT NULL DEFAULT FALSE"))
        conn.execute(text("ALTER TABLE reports ADD COLUMN IF NOT EXISTS stripe_customer TEXT"))
        conn.execute(text("ALTER TABLE reports ADD COLUMN IF NOT EXISTS stripe_subscription TEXT"))
        conn.execute(
            text(
                "CREATE TABLE IF NOT EXISTS score_history ("
                "id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, "
                "site_id UUID NOT NULL, "
                "score INTEGER NOT NULL, "
                "brand_mentions INTEGER NOT NULL, "
                "total_queries INTEGER NOT NULL, "
                "created_at TIMESTAMPTZ DEFAULT now())"
            )
        )
        conn.execute(text("CREATE INDEX IF NOT EXISTS score_history_site_idx ON score_history (site_id, created_at)"))


class OnboardingRequest(BaseModel):
    companyName: str = Field(min_length=2, max_length=120)
    websiteUrl: AnyHttpUrl
    email: str = Field(min_length=5, max_length=200, pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    city: str = Field(min_length=2, max_length=100)
    industry: str = Field(min_length=2, max_length=120)
    services: Optional[str] = Field(default=None, max_length=500)


class QueryResult(BaseModel):
    query: str
    engine: str
    brand_mentioned: bool
    competitors_detected: List[str]
    confidence: float
    answer_excerpt: Optional[str] = None


class Recommendation(BaseModel):
    title: str
    description: str
    priority: str
    estimated_impact: str


class ScorePoint(BaseModel):
    score: int
    brand_mentions: int
    total_queries: int
    date: str


class DashboardData(BaseModel):
    site_id: str
    company_name: str
    website_url: str
    city: str
    industry: str
    services: Optional[str] = None
    visibility_score: int
    total_queries: int
    brand_mentions: int
    top_competitor: str
    top_competitor_mentions: int
    queries: List[QueryResult]
    recommendations: List[Recommendation]
    mode: str = "simulation"
    unlocked: bool = True
    history: List[ScorePoint] = []
    site_audit: Optional[SiteAudit] = None


# In-memory fallback when no database is configured (local development).
MEMORY_DB: dict[str, DashboardData] = {}
MEMORY_EMAILS: dict[str, str] = {}


def save_report(dashboard: DashboardData, email: Optional[str] = None) -> None:
    if db_engine is None:
        MEMORY_DB[dashboard.site_id] = dashboard
        if email:
            MEMORY_EMAILS[dashboard.site_id] = email
        return
    with db_engine.begin() as conn:
        conn.execute(
            text(
                "INSERT INTO reports (site_id, payload, email, unlocked) "
                "VALUES (:site_id, CAST(:payload AS jsonb), :email, :unlocked) "
                "ON CONFLICT (site_id) DO UPDATE SET payload = EXCLUDED.payload, "
                "email = COALESCE(EXCLUDED.email, reports.email)"
            ),
            {
                "site_id": dashboard.site_id,
                "payload": dashboard.model_dump_json(),
                "email": email,
                "unlocked": dashboard.unlocked,
            },
        )


def load_report(site_id: str) -> Optional[DashboardData]:
    if db_engine is None:
        return MEMORY_DB.get(site_id)
    with db_engine.begin() as conn:
        row = conn.execute(
            text("SELECT payload, unlocked FROM reports WHERE site_id = :site_id"),
            {"site_id": site_id},
        ).fetchone()
    if row is None:
        return None
    dashboard = DashboardData.model_validate(row[0])
    dashboard.unlocked = bool(row[1])
    dashboard.history = load_history(site_id)
    return dashboard


def record_history(dashboard: DashboardData) -> None:
    if db_engine is None or dashboard.mode != "live":
        return
    with db_engine.begin() as conn:
        conn.execute(
            text(
                "INSERT INTO score_history (site_id, score, brand_mentions, total_queries) "
                "VALUES (:site_id, :score, :mentions, :total)"
            ),
            {
                "site_id": dashboard.site_id,
                "score": dashboard.visibility_score,
                "mentions": dashboard.brand_mentions,
                "total": dashboard.total_queries,
            },
        )


def load_history(site_id: str) -> List[ScorePoint]:
    if db_engine is None:
        return []
    with db_engine.begin() as conn:
        rows = conn.execute(
            text(
                "SELECT score, brand_mentions, total_queries, created_at FROM score_history "
                "WHERE site_id = :site_id ORDER BY created_at DESC LIMIT 12"
            ),
            {"site_id": site_id},
        ).fetchall()
    return [
        ScorePoint(score=row[0], brand_mentions=row[1], total_queries=row[2], date=row[3].date().isoformat())
        for row in reversed(rows)
    ]


def get_report_email(site_id: str) -> Optional[str]:
    if db_engine is None:
        return MEMORY_EMAILS.get(site_id)
    with db_engine.begin() as conn:
        row = conn.execute(
            text("SELECT email FROM reports WHERE site_id = :site_id"),
            {"site_id": site_id},
        ).fetchone()
    return row[0] if row else None


def unlock_report(site_id: str, customer: Optional[str], subscription: Optional[str]) -> None:
    if db_engine is None:
        if site_id in MEMORY_DB:
            MEMORY_DB[site_id].unlocked = True
        return
    with db_engine.begin() as conn:
        conn.execute(
            text(
                "UPDATE reports SET unlocked = TRUE, stripe_customer = :customer, "
                "stripe_subscription = :subscription WHERE site_id = :site_id"
            ),
            {"site_id": site_id, "customer": customer, "subscription": subscription},
        )


def build_queries(request: OnboardingRequest) -> List[str]:
    city = request.city.strip().title()
    industry = request.industry.strip()
    service = (request.services or industry).split(",")[0].strip()
    return [
        f"Who is the best {industry.lower()} professional in {city}?",
        f"Who would you recommend for {service.lower()} in {city}?",
        f"Which {industry.lower()} companies are reliable in {city}?",
        f"I'm looking for {service.lower()} specialists near {city}",
        f"What are the top-rated {industry.lower()} professionals in {city}?",
        f"Which company should I contact quickly for {service.lower()} in {city}?",
        f"Compare the best {industry.lower()} providers in {city}",
        f"Who should I hire for {industry.lower()} work in the {city} area?",
        f"Which local {industry.lower()} expert should I choose in {city}?",
        f"Reviews and recommendations for {service.lower()} in {city}",
    ]


def build_recommendations(request: OnboardingRequest) -> List[Recommendation]:
    city = request.city.strip().title()
    industry = request.industry.strip()
    service = (request.services or industry).split(",")[0].strip()
    return [
        Recommendation(
            title="Create a local FAQ page",
            description=(
                f"Answer the questions customers actually ask about {service.lower()} "
                f"and the areas you serve around {city}."
            ),
            priority="high",
            estimated_impact="high",
        ),
        Recommendation(
            title="Add LocalBusiness structured data",
            description=(
                "Mark up your business name, address, phone number and services "
                "so AI engines can verify this information."
            ),
            priority="medium",
            estimated_impact="medium",
        ),
        Recommendation(
            title="Strengthen your Services page",
            description=(
                f"Describe your {industry.lower()} specialties, proof of expertise "
                f"and local projects completed in {city}."
            ),
            priority="low",
            estimated_impact="low",
        ),
    ]


# ---------------------------------------------------------------------------
# Live scan (real AI engine answers)
# ---------------------------------------------------------------------------

ANSWER_SYSTEM_PROMPT = (
    "You are a helpful assistant answering a consumer looking for a local business. "
    "Answer naturally and concisely, in the same language as the question. "
    "Name specific local businesses when you know of any; "
    "if you don't know specific businesses, say so and give general advice."
)

QUERY_GENERATION_SYSTEM_PROMPT = (
    "You generate realistic consumer search queries for AI assistants. "
    "Write short, natural questions that local consumers would actually ask an AI assistant "
    "(like ChatGPT) when looking for this type of business in this city. "
    "Never mention the business name itself. Vary the intent: best, recommendation, "
    "comparison, urgency, reviews, nearby. Every query MUST explicitly name the city — "
    'never use vague locations like "near me" or "close to home". '
    "CRITICAL: write the questions in the language consumers in that city most likely use "
    "(e.g. French for Marseille, English for Austin, Spanish for Madrid). "
    'Respond with JSON only: {"queries": ["...", "..."]}'
)

RECOMMENDATION_SYSTEM_PROMPT = (
    "You are an AI-visibility (GEO) consultant for local businesses. You are given the real answers "
    "that AI engines gave when consumers asked for recommendations in the business's market, plus "
    "whether the business was mentioned and which competitors were. Produce specific, actionable "
    "recommendations that will increase how often AI engines recommend this business. "
    "Be concrete: name the competitors that dominate the answers, reference what the engines actually "
    "said, and tie each recommendation to evidence from the answers. Each description is 2-4 sentences "
    "written directly to the business owner. Write in the same language as the consumer queries. "
    'Respond with JSON only: {"recommendations": [{"title": "...", "description": "...", '
    '"priority": "high|medium|low", "estimated_impact": "high|medium|low"}]} — 3 to 5 items, '
    "highest priority first."
)

EXTRACTION_SYSTEM_PROMPT = (
    "You analyze AI assistant answers to local business recommendation questions. "
    "For each numbered answer, list the specific competing business names explicitly mentioned. "
    "Include only actual businesses a consumer could hire or visit — exclude generic terms, "
    "review sites, directories, listing portals, marketplaces and aggregators of any industry "
    "(e.g. Yelp, Google, TripAdvisor, SeLoger, Zillow, Booking, LeBonCoin, Angi, Thumbtack). "
    "Also say whether the target brand is mentioned, including close or partial variants of its name. "
    'Respond with JSON only: {"results": [{"index": 1, "brand_mentioned": false, "businesses": ["..."]}]}'
)


def make_excerpt(answer: str, limit: int = 350) -> str:
    collapsed = re.sub(r"\s+", " ", answer).strip()
    if len(collapsed) <= limit:
        return collapsed
    return collapsed[:limit].rsplit(" ", 1)[0] + "…"


def normalize_name(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]", "", value.lower())


def brand_variants(name: str) -> List[str]:
    base = name.strip()
    no_suffix = re.sub(
        r"\b(llc|inc|corp|co|company|ltd|group|services?)\b\.?", "", base, flags=re.IGNORECASE
    ).strip()
    variants = {normalize_name(base)}
    if no_suffix:
        variants.add(normalize_name(no_suffix))
    return [variant for variant in variants if len(variant) >= 3]


def brand_in_text(variants: List[str], answer: str) -> bool:
    normalized = normalize_name(answer)
    return any(variant in normalized for variant in variants)


async def generate_queries_llm(client, request: OnboardingRequest) -> Optional[List[str]]:
    details = (
        f"Industry: {request.industry.strip()}\n"
        f"City: {request.city.strip().title()}\n"
        f"Main services: {(request.services or request.industry).strip()}"
    )
    try:
        response = await client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": QUERY_GENERATION_SYSTEM_PROMPT},
                {"role": "user", "content": f"{details}\n\nGenerate exactly 10 queries."},
            ],
            response_format={"type": "json_object"},
            max_tokens=800,
            temperature=0.4,
            timeout=45,
        )
        payload = json.loads(response.choices[0].message.content or "{}")
        queries = [q.strip() for q in payload.get("queries", []) if isinstance(q, str) and q.strip()]
        return queries[:10] if len(queries) >= 5 else None
    except Exception:
        return None


async def ask_engine(client, query: str, model: str = OPENAI_MODEL) -> Optional[str]:
    try:
        response = await client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": ANSWER_SYSTEM_PROMPT},
                {"role": "user", "content": query},
            ],
            max_tokens=400,
            temperature=0.7,
            timeout=45,
        )
        return response.choices[0].message.content or ""
    except Exception:
        return None


async def ask_claude(client, query: str) -> Optional[str]:
    try:
        response = await client.messages.create(
            model=ANTHROPIC_MODEL,
            max_tokens=400,
            system=ANSWER_SYSTEM_PROMPT,
            messages=[{"role": "user", "content": query}],
            timeout=45,
        )
        if response.stop_reason == "refusal":
            return None
        return "".join(block.text for block in response.content if block.type == "text") or None
    except Exception:
        return None


async def extract_mentions(client, brand: str, answers: List[str]) -> Optional[list]:
    numbered = "\n\n".join(f"Answer {index + 1}:\n{answer}" for index, answer in enumerate(answers))
    try:
        response = await client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": EXTRACTION_SYSTEM_PROMPT},
                {"role": "user", "content": f'Target brand: "{brand}"\n\n{numbered}'},
            ],
            response_format={"type": "json_object"},
            max_tokens=1500,
            temperature=0,
            timeout=60,
        )
        payload = json.loads(response.choices[0].message.content or "{}")
        results = payload.get("results")
        return results if isinstance(results, list) else None
    except Exception:
        return None


async def generate_recommendations_llm(
    client,
    request: OnboardingRequest,
    results: List[QueryResult],
    top_competitors: List[tuple],
    site: Optional[SiteAudit] = None,
) -> Optional[List[Recommendation]]:
    digest_lines = []
    for result in results:
        digest_lines.append(
            f"[{result.engine}] Q: {result.query}\n"
            f"Business mentioned: {'yes' if result.brand_mentioned else 'no'} | "
            f"Competitors cited: {', '.join(result.competitors_detected) or 'none'}\n"
            f"Answer excerpt: {result.answer_excerpt or '(unavailable)'}"
        )
    mentions = sum(1 for r in results if r.brand_mentioned)
    competitors_summary = ", ".join(f"{name} ({count} mentions)" for name, count in top_competitors[:5]) or "none"
    profile = (
        f"Business: {request.companyName.strip()}\n"
        f"Website: {request.websiteUrl}\n"
        f"City: {request.city.strip().title()} | Industry: {request.industry.strip()} | "
        f"Services: {(request.services or request.industry).strip()}\n"
        f"Visibility: mentioned in {mentions}/{len(results)} answers | Top competitors: {competitors_summary}"
    )
    site_section = ""
    if site is not None and site.fetched and site.content_digest:
        site_section = (
            "\n\n--- AUDIT OF THE BUSINESS'S OWN WEBSITE (facts verified by fetching the page) ---\n\n"
            f"{site.content_digest}\n\n"
            "Ground your recommendations in these verified findings: never tell the owner to add something "
            "the audit shows they already have, and prioritize the checks that failed."
        )
    try:
        response = await client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": RECOMMENDATION_SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": f"{profile}\n\n--- REAL AI ANSWERS ---\n\n"
                    + "\n\n".join(digest_lines)
                    + site_section,
                },
            ],
            response_format={"type": "json_object"},
            max_tokens=1200,
            temperature=0.3,
            timeout=60,
        )
        payload = json.loads(response.choices[0].message.content or "{}")
        items = payload.get("recommendations")
        if not isinstance(items, list):
            return None
        recommendations = []
        for item in items[:5]:
            if not isinstance(item, dict):
                continue
            title = str(item.get("title", "")).strip()
            description = str(item.get("description", "")).strip()
            priority = item.get("priority") if item.get("priority") in ("high", "medium", "low") else "medium"
            impact = item.get("estimated_impact") if item.get("estimated_impact") in ("high", "medium", "low") else "medium"
            if title and description:
                recommendations.append(
                    Recommendation(title=title, description=description, priority=priority, estimated_impact=impact)
                )
        return recommendations if len(recommendations) >= 3 else None
    except Exception:
        return None


async def run_live_scan(site_id: str, request: OnboardingRequest) -> DashboardData:
    from openai import AsyncOpenAI

    client = AsyncOpenAI(api_key=OPENAI_API_KEY)
    # The website audit runs alongside query generation — it never blocks the scan.
    site_task = asyncio.create_task(
        audit_site(
            str(request.websiteUrl),
            request.city.strip(),
            request.industry.strip(),
            request.services or request.industry,
        )
    )
    queries = await generate_queries_llm(client, request) or build_queries(request)
    semaphore = asyncio.Semaphore(6)

    engines: list[tuple[str, str, object]] = [("ChatGPT", "openai", client)]
    if ANTHROPIC_API_KEY:
        from anthropic import AsyncAnthropic

        engines.append(("Claude", "anthropic", AsyncAnthropic(api_key=ANTHROPIC_API_KEY)))
    if PERPLEXITY_API_KEY:
        engines.append(
            (
                "Perplexity",
                "perplexity",
                AsyncOpenAI(api_key=PERPLEXITY_API_KEY, base_url="https://api.perplexity.ai"),
            )
        )

    async def guarded_ask(kind: str, engine_client, query: str) -> Optional[str]:
        async with semaphore:
            if kind == "anthropic":
                return await ask_claude(engine_client, query)
            if kind == "perplexity":
                return await ask_engine(engine_client, query, model=PERPLEXITY_MODEL)
            return await ask_engine(engine_client, query)

    labels: list[tuple[str, str]] = []
    tasks = []
    for engine_name, kind, engine_client in engines:
        for query in queries:
            labels.append((engine_name, query))
            tasks.append(guarded_ask(kind, engine_client, query))

    answers = await asyncio.gather(*tasks)
    answered = [
        (engine_name, query, answer)
        for (engine_name, query), answer in zip(labels, answers)
        if answer
    ]
    if not answered:
        raise HTTPException(status_code=502, detail="AI engines are unreachable right now, please retry")

    extraction = await extract_mentions(client, request.companyName, [answer for _, _, answer in answered])
    extraction_by_index = {}
    if extraction:
        for item in extraction:
            if isinstance(item, dict) and isinstance(item.get("index"), int):
                extraction_by_index[item["index"] - 1] = item

    variants = brand_variants(request.companyName)
    results: list[QueryResult] = []
    brand_mentions = 0
    competitor_mentions: Counter[str] = Counter()

    for index, (engine_name, query, answer) in enumerate(answered):
        local_mentioned = brand_in_text(variants, answer)
        extracted = extraction_by_index.get(index)
        if extracted is not None:
            llm_mentioned = bool(extracted.get("brand_mentioned"))
            mentioned = llm_mentioned or local_mentioned
            confidence = 0.95 if llm_mentioned == local_mentioned else 0.75
            businesses = [
                name.strip()
                for name in extracted.get("businesses", [])
                if isinstance(name, str) and name.strip()
            ]
        else:
            mentioned = local_mentioned
            confidence = 0.7
            businesses = []

        competitors = [name for name in businesses if not brand_in_text(variants, name)][:3]
        if mentioned:
            brand_mentions += 1
        competitor_mentions.update(competitors)

        results.append(
            QueryResult(
                query=query,
                engine=engine_name,
                brand_mentioned=mentioned,
                competitors_detected=competitors,
                confidence=confidence,
                answer_excerpt=make_excerpt(answer),
            )
        )

    if competitor_mentions:
        top_competitor, top_competitor_mentions = competitor_mentions.most_common(1)[0]
    else:
        top_competitor, top_competitor_mentions = "No competitor detected", 0

    try:
        site = await site_task
    except Exception:
        site = None

    recommendations = await generate_recommendations_llm(
        client, request, results, competitor_mentions.most_common(5), site
    ) or build_recommendations(request)

    return DashboardData(
        site_id=site_id,
        company_name=request.companyName.strip(),
        website_url=str(request.websiteUrl),
        city=request.city.strip().title(),
        industry=request.industry.strip(),
        services=request.services,
        visibility_score=round((brand_mentions / len(results)) * 100),
        total_queries=len(results),
        brand_mentions=brand_mentions,
        top_competitor=top_competitor,
        top_competitor_mentions=top_competitor_mentions,
        queries=results,
        recommendations=recommendations,
        mode="live",
        site_audit=site,
    )


# ---------------------------------------------------------------------------
# Simulation fallback (used when no AI engine API key is configured)
# ---------------------------------------------------------------------------

def generate_mock_dashboard_data(site_id: str, request: OnboardingRequest) -> DashboardData:
    rng = random.Random(site_id)
    city = request.city.strip().title()
    industry = request.industry.strip()
    engines = ["ChatGPT", "Perplexity", "Claude"]
    base_queries = build_queries(request)
    competitors = [
        f"{city} {industry.title()} Experts",
        f"{city} Pro Services",
        f"{industry.title()} Direct",
    ]

    results: list[QueryResult] = []
    brand_mentions = 0
    competitor_mentions: Counter[str] = Counter({competitor: 0 for competitor in competitors})

    for index in range(20):
        query = base_queries[index % len(base_queries)]
        engine = engines[index % len(engines)]
        mentioned = rng.random() > 0.58
        detected_competitors = rng.sample(competitors, k=rng.randint(0, 2))

        if mentioned:
            brand_mentions += 1
        competitor_mentions.update(detected_competitors)

        results.append(
            QueryResult(
                query=query,
                engine=engine,
                brand_mentioned=mentioned,
                competitors_detected=detected_competitors,
                confidence=round(rng.uniform(0.67, 0.98), 2),
            )
        )

    top_competitor, top_competitor_mentions = competitor_mentions.most_common(1)[0]

    return DashboardData(
        site_id=site_id,
        company_name=request.companyName.strip(),
        website_url=str(request.websiteUrl),
        city=city,
        industry=industry,
        services=request.services,
        visibility_score=round((brand_mentions / len(results)) * 100),
        total_queries=len(results),
        brand_mentions=brand_mentions,
        top_competitor=top_competitor,
        top_competitor_mentions=top_competitor_mentions,
        queries=results,
        recommendations=build_recommendations(request),
        mode="simulation",
    )


# ---------------------------------------------------------------------------
# Weekly re-scans for paying subscribers
# ---------------------------------------------------------------------------

RESCAN_AFTER_DAYS = 7


def reports_due_for_rescan() -> List[str]:
    with db_engine.begin() as conn:
        rows = conn.execute(
            text(
                "SELECT r.site_id::text FROM reports r "
                "WHERE r.unlocked = TRUE AND COALESCE("
                "(SELECT max(h.created_at) FROM score_history h WHERE h.site_id = r.site_id), "
                "r.created_at) < now() - make_interval(days => :days) "
                "LIMIT 20"
            ),
            {"days": RESCAN_AFTER_DAYS},
        ).fetchall()
    return [row[0] for row in rows]


async def rescan_report(site_id: str) -> None:
    previous = await asyncio.to_thread(load_report, site_id)
    if previous is None:
        return
    email = await asyncio.to_thread(get_report_email, site_id)
    request = OnboardingRequest(
        companyName=previous.company_name,
        websiteUrl=previous.website_url,
        email=email or "rescan@getintheanswer.com",
        city=previous.city,
        industry=previous.industry,
        services=previous.services,
    )
    dashboard = await run_live_scan(site_id, request)
    dashboard.unlocked = True
    await asyncio.to_thread(save_report, dashboard, None)
    await asyncio.to_thread(record_history, dashboard)


async def weekly_rescan_loop() -> None:
    while True:
        await asyncio.sleep(3600)
        # Re-scans only make sense with real engines, persistence and actual
        # paying subscribers (unlocked reports only exist when billing is on).
        if not (LIVE_MODE and BILLING_ENABLED and db_engine is not None):
            continue
        try:
            for site_id in await asyncio.to_thread(reports_due_for_rescan):
                try:
                    await rescan_report(site_id)
                except Exception:
                    continue
        except Exception:
            continue


@app.on_event("startup")
async def start_rescan_scheduler() -> None:
    asyncio.create_task(weekly_rescan_loop())


@app.get("/api/health")
def healthcheck():
    return {
        "status": "ok",
        "mode": "live" if LIVE_MODE else "simulation",
        "persistent": db_engine is not None,
        "billing": BILLING_ENABLED,
    }


@app.post("/api/onboarding")
async def onboard_site(request: OnboardingRequest):
    site_id = str(uuid.uuid4())
    dashboard = None
    if LIVE_MODE:
        try:
            dashboard = await run_live_scan(site_id, request)
        except HTTPException:
            # Live engines unavailable (no credits, outage…): degrade to a
            # clearly-labeled simulation instead of failing the onboarding.
            dashboard = None
    if dashboard is None:
        dashboard = generate_mock_dashboard_data(site_id, request)
    dashboard.unlocked = not BILLING_ENABLED
    save_report(dashboard, email=request.email)
    record_history(dashboard)
    return {"site_id": site_id, "status": "completed", "mode": dashboard.mode}


class CheckoutRequest(BaseModel):
    site_id: str


@app.post("/api/checkout")
def create_checkout(body: CheckoutRequest):
    if not BILLING_ENABLED:
        raise HTTPException(status_code=503, detail="Billing is not configured")
    try:
        uuid.UUID(body.site_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Report not found")
    if load_report(body.site_id) is None:
        raise HTTPException(status_code=404, detail="Report not found")

    session = stripe.checkout.Session.create(
        mode="subscription",
        line_items=[{"price": STRIPE_PRICE_ID, "quantity": 1}],
        success_url=f"{FRONTEND_URL}/dashboard?site_id={body.site_id}&session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{FRONTEND_URL}/dashboard?site_id={body.site_id}",
        customer_email=get_report_email(body.site_id),
        metadata={"site_id": body.site_id},
        allow_promotion_codes=True,
    )
    return {"url": session.url}


@app.get("/api/checkout/confirm")
def confirm_checkout(session_id: str, site_id: str):
    if not BILLING_ENABLED:
        raise HTTPException(status_code=503, detail="Billing is not configured")
    try:
        session = stripe.checkout.Session.retrieve(session_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Checkout session not found")
    # stripe-python v15 objects are attribute-access only — .get() raises AttributeError.
    payment_status = getattr(session, "payment_status", None)
    metadata = getattr(session, "metadata", None)
    meta_site_id = getattr(metadata, "site_id", None) if metadata is not None else None
    if payment_status in ("paid", "no_payment_required") and meta_site_id == site_id:
        customer = getattr(session, "customer", None)
        subscription = getattr(session, "subscription", None)
        unlock_report(
            site_id,
            customer if isinstance(customer, str) else getattr(customer, "id", None),
            subscription if isinstance(subscription, str) else getattr(subscription, "id", None),
        )
        return {"unlocked": True}
    return {"unlocked": False}


@app.get("/api/dashboard/{site_id}", response_model=DashboardData)
def get_dashboard(site_id: str):
    try:
        uuid.UUID(site_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Report not found")
    dashboard = load_report(site_id)
    if dashboard is None:
        raise HTTPException(status_code=404, detail="Report not found")
    return dashboard


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        reload=True,
    )

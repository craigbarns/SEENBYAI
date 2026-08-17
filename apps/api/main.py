import asyncio
import json
import os
import random
import re
import unicodedata
import uuid
from collections import Counter
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import AnyHttpUrl, BaseModel, Field
from sqlalchemy import create_engine, text

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "").strip()
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()
LIVE_MODE = bool(OPENAI_API_KEY)

app = FastAPI(
    title="LLM Rank API",
    description="Backend API for LLM Rank — AI visibility scans for local businesses",
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


class OnboardingRequest(BaseModel):
    companyName: str = Field(min_length=2, max_length=120)
    websiteUrl: AnyHttpUrl
    city: str = Field(min_length=2, max_length=100)
    industry: str = Field(min_length=2, max_length=120)
    services: Optional[str] = Field(default=None, max_length=500)


class QueryResult(BaseModel):
    query: str
    engine: str
    brand_mentioned: bool
    competitors_detected: List[str]
    confidence: float


class Recommendation(BaseModel):
    title: str
    description: str
    priority: str
    estimated_impact: str


class DashboardData(BaseModel):
    site_id: str
    company_name: str
    website_url: str
    city: str
    industry: str
    visibility_score: int
    total_queries: int
    brand_mentions: int
    top_competitor: str
    top_competitor_mentions: int
    queries: List[QueryResult]
    recommendations: List[Recommendation]
    mode: str = "simulation"


# In-memory fallback when no database is configured (local development).
MEMORY_DB: dict[str, DashboardData] = {}


def save_report(dashboard: DashboardData) -> None:
    if db_engine is None:
        MEMORY_DB[dashboard.site_id] = dashboard
        return
    with db_engine.begin() as conn:
        conn.execute(
            text(
                "INSERT INTO reports (site_id, payload) VALUES (:site_id, CAST(:payload AS jsonb)) "
                "ON CONFLICT (site_id) DO UPDATE SET payload = EXCLUDED.payload"
            ),
            {"site_id": dashboard.site_id, "payload": dashboard.model_dump_json()},
        )


def load_report(site_id: str) -> Optional[DashboardData]:
    if db_engine is None:
        return MEMORY_DB.get(site_id)
    with db_engine.begin() as conn:
        row = conn.execute(
            text("SELECT payload FROM reports WHERE site_id = :site_id"),
            {"site_id": site_id},
        ).fetchone()
    return DashboardData.model_validate(row[0]) if row else None


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
    "comparison, urgency, reviews, nearby. "
    "CRITICAL: write the questions in the language consumers in that city most likely use "
    "(e.g. French for Marseille, English for Austin, Spanish for Madrid). "
    'Respond with JSON only: {"queries": ["...", "..."]}'
)

EXTRACTION_SYSTEM_PROMPT = (
    "You analyze AI assistant answers to local business recommendation questions. "
    "For each numbered answer, list the specific business names explicitly mentioned "
    "(company names only, not generic terms, directories or platforms like Yelp or Google), "
    "and say whether the target brand is mentioned, including close or partial variants of its name. "
    'Respond with JSON only: {"results": [{"index": 1, "brand_mentioned": false, "businesses": ["..."]}]}'
)


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


async def ask_engine(client, query: str) -> Optional[str]:
    try:
        response = await client.chat.completions.create(
            model=OPENAI_MODEL,
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


async def run_live_scan(site_id: str, request: OnboardingRequest) -> DashboardData:
    from openai import AsyncOpenAI

    client = AsyncOpenAI(api_key=OPENAI_API_KEY)
    queries = await generate_queries_llm(client, request) or build_queries(request)
    semaphore = asyncio.Semaphore(5)

    async def guarded_ask(query: str) -> Optional[str]:
        async with semaphore:
            return await ask_engine(client, query)

    answers = await asyncio.gather(*(guarded_ask(query) for query in queries))
    answered = [(query, answer) for query, answer in zip(queries, answers) if answer]
    if not answered:
        raise HTTPException(status_code=502, detail="AI engines are unreachable right now, please retry")

    extraction = await extract_mentions(client, request.companyName, [answer for _, answer in answered])
    extraction_by_index = {}
    if extraction:
        for item in extraction:
            if isinstance(item, dict) and isinstance(item.get("index"), int):
                extraction_by_index[item["index"] - 1] = item

    variants = brand_variants(request.companyName)
    results: list[QueryResult] = []
    brand_mentions = 0
    competitor_mentions: Counter[str] = Counter()

    for index, (query, answer) in enumerate(answered):
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
                engine="ChatGPT",
                brand_mentioned=mentioned,
                competitors_detected=competitors,
                confidence=confidence,
            )
        )

    if competitor_mentions:
        top_competitor, top_competitor_mentions = competitor_mentions.most_common(1)[0]
    else:
        top_competitor, top_competitor_mentions = "No competitor detected", 0

    return DashboardData(
        site_id=site_id,
        company_name=request.companyName.strip(),
        website_url=str(request.websiteUrl),
        city=request.city.strip().title(),
        industry=request.industry.strip(),
        visibility_score=round((brand_mentions / len(results)) * 100),
        total_queries=len(results),
        brand_mentions=brand_mentions,
        top_competitor=top_competitor,
        top_competitor_mentions=top_competitor_mentions,
        queries=results,
        recommendations=build_recommendations(request),
        mode="live",
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
        visibility_score=round((brand_mentions / len(results)) * 100),
        total_queries=len(results),
        brand_mentions=brand_mentions,
        top_competitor=top_competitor,
        top_competitor_mentions=top_competitor_mentions,
        queries=results,
        recommendations=build_recommendations(request),
        mode="simulation",
    )


@app.get("/api/health")
def healthcheck():
    return {"status": "ok", "mode": "live" if LIVE_MODE else "simulation", "persistent": db_engine is not None}


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
    save_report(dashboard)
    return {"site_id": site_id, "status": "completed", "mode": dashboard.mode}


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

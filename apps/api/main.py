from collections import Counter
import os
import random
import uuid
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import AnyHttpUrl, BaseModel, Field


app = FastAPI(
    title="SeenByAI API",
    description="Backend API for the SeenByAI visibility simulator",
    version="1.1.0",
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


# The MVP keeps reports in memory. The seeded generator makes a given report stable
# for its whole lifetime, which is more useful when reviewing the same dashboard.
MOCK_DB: dict[str, DashboardData] = {}


def generate_mock_dashboard_data(site_id: str, request: OnboardingRequest) -> DashboardData:
    rng = random.Random(site_id)
    city = request.city.strip().title()
    industry = request.industry.strip()
    service = (request.services or industry).split(",")[0].strip()
    engines = ["ChatGPT", "Perplexity", "Claude"]
    base_queries = [
        f"Quel est le meilleur professionnel en {industry.lower()} à {city} ?",
        f"Qui recommandez-vous pour {service.lower()} à {city} ?",
        f"Quelles entreprises de {industry.lower()} sont fiables à {city} ?",
        f"Je cherche un spécialiste de {service.lower()} près de {city}",
        f"Quels sont les professionnels de {industry.lower()} les mieux notés à {city} ?",
        f"Quelle entreprise contacter rapidement pour {service.lower()} à {city} ?",
        f"Comparez les meilleurs prestataires de {industry.lower()} à {city}",
        f"À qui faire appel pour un projet de {industry.lower()} dans la région de {city} ?",
        f"Quel expert local de {industry.lower()} choisir à {city} ?",
        f"Avis et recommandations pour {service.lower()} à {city}",
    ]
    competitors = [
        f"{industry.title()} Expert {city}",
        f"Les Pros de {city}",
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
    visibility_score = round((brand_mentions / len(results)) * 100)
    recommendations = [
        Recommendation(
            title="Créer une FAQ locale",
            description=(
                f"Répondez directement aux questions fréquentes sur {service.lower()} "
                f"et vos zones d’intervention autour de {city}."
            ),
            priority="high",
            estimated_impact="fort",
        ),
        Recommendation(
            title="Ajouter le balisage LocalBusiness",
            description=(
                "Structurez le nom, l’adresse, le téléphone et les services de l’entreprise "
                "pour rendre ces informations vérifiables par les moteurs."
            ),
            priority="medium",
            estimated_impact="moyen",
        ),
        Recommendation(
            title="Enrichir la page Services",
            description=(
                f"Décrivez vos spécialités de {industry.lower()}, vos preuves d’expertise "
                f"et vos réalisations locales à {city}."
            ),
            priority="low",
            estimated_impact="faible",
        ),
    ]

    dashboard = DashboardData(
        site_id=site_id,
        company_name=request.companyName.strip(),
        website_url=str(request.websiteUrl),
        city=city,
        industry=industry,
        visibility_score=visibility_score,
        total_queries=len(results),
        brand_mentions=brand_mentions,
        top_competitor=top_competitor,
        top_competitor_mentions=top_competitor_mentions,
        queries=results,
        recommendations=recommendations,
    )
    MOCK_DB[site_id] = dashboard
    return dashboard


@app.get("/api/health")
def healthcheck():
    return {"status": "ok", "mode": "simulation"}


@app.post("/api/onboarding")
def onboard_site(request: OnboardingRequest):
    site_id = str(uuid.uuid4())
    generate_mock_dashboard_data(site_id, request)
    return {"site_id": site_id, "status": "completed"}


@app.get("/api/dashboard/{site_id}", response_model=DashboardData)
def get_dashboard(site_id: str):
    dashboard = MOCK_DB.get(site_id)
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

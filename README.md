# GetInTheAnswer (ex-SeenByAI)

**"Est-ce que l’IA recommande votre entreprise ?"**

SeenByAI est une application SaaS B2B destinée aux PME locales pour mesurer et améliorer leur visibilité dans les réponses des moteurs IA.

## Architecture

- **Frontend**: Next.js (App Router) + TypeScript + TailwindCSS + shadcn/ui
- **Backend API**: FastAPI (Python)
- **Base de données**: PostgreSQL + Supabase (Auth, RLS)
- **Workers**: Celery / Redis (pour l'exécution asynchrone des scans)
- **Déploiement**: Docker Compose (Local), Railway (Prod)
- **Paiements**: Stripe

## Structure du projet

- `apps/web` : Application Next.js.
- `apps/api` : API FastAPI.
- `packages/shared` : Types partagés (si applicable) ou utilitaires.
- `packages/scoring` : Moteur de scoring déterministe.
- `packages/providers` : Adapters pour les moteurs IA (mock, openai, perplexity, etc.).
- `workers/scanner` : Workers asynchrones pour les requêtes IA.
- `supabase/migrations` : Schémas et politiques RLS de la base de données.
- `tests` : Tests unitaires et d'intégration.
- `docker` : Fichiers Dockerfile.

## Checklist (MVP)

- [x] Initialisation du projet (Next.js, FastAPI, Docker Compose)
- [x] Configuration UI (Tailwind, shadcn/ui)
- [ ] Modélisation de la base de données (Supabase Migrations)
- [ ] Implémentation du backend (API)
- [ ] Intégration Supabase Auth
- [ ] Onboarding (Génération des requêtes)
- [ ] Scan Engine (Adapters & Mock mode)
- [ ] Scoring Engine
- [ ] Détection des concurrents
- [ ] Moteur de Recommandations
- [ ] UI Landing Page
- [ ] UI Dashboard (Score, Mentions, Concurrents, Actions)
- [ ] Intégration Stripe Checkout
- [ ] Weekly Report (Mock/Stub)

## Lancement local

```bash
docker-compose up -d
```

Pour le développement frontend :
```bash
cd apps/web
npm run dev
```

Pour le développement backend :
```bash
cd apps/api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

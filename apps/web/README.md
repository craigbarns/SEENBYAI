# SeenByAI Web

Interface Next.js de SeenByAI : landing page, onboarding et rapport de visibilité IA.

## Démarrage local

L’API FastAPI doit être accessible avant de lancer le frontend.

```bash
# apps/api
uvicorn main:app --reload --port 8001

# apps/web
npm install
npm run dev
```

Le frontend utilise `http://127.0.0.1:8001` par défaut. Pour choisir une autre URL :

```bash
SEENBYAI_API_URL=http://127.0.0.1:8000 npm run dev
```

Cette variable reste côté serveur. Le navigateur envoie l’onboarding au Route Handler Next.js, qui relaie ensuite la requête à FastAPI.

## Vérifications

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Routes

- `/` : présentation du produit et aperçu du rapport.
- `/onboarding` : création d’une analyse.
- `/dashboard?site_id=…` : rapport d’une analyse existante.

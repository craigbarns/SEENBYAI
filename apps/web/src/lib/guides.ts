export interface GuideSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export interface Guide {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  datePublished: string;
  readingMinutes: number;
  intro: string[];
  sections: GuideSection[];
}

export const guides: Guide[] = [
  {
    slug: "get-recommended-by-chatgpt",
    title: "How to Get Your Business Recommended by ChatGPT",
    metaTitle: "How to Get Recommended by ChatGPT (2026 Guide for Local Businesses)",
    description:
      "A practical, step-by-step guide to getting your local business mentioned and recommended in ChatGPT, Claude and Perplexity answers.",
    datePublished: "2026-08-17",
    readingMinutes: 7,
    intro: [
      "When someone asks ChatGPT “who's the best plumber near me?” or “which kitchen remodeler should I hire in Austin?”, the AI names specific businesses. If yours isn't one of them, you're invisible to a fast-growing share of your market — and your competitors are collecting those customers instead.",
      "Unlike traditional SEO, there is no submission form and no ad budget that puts you in an AI answer. Large language models recommend businesses they have strong, consistent, verifiable signals about. This guide covers exactly which signals matter and how to build them.",
    ],
    sections: [
      {
        heading: "How AI engines decide which businesses to recommend",
        paragraphs: [
          "ChatGPT, Claude and Perplexity draw on two sources: what their models learned during training (articles, directories, reviews, your website) and, increasingly, live web search results they retrieve at answer time. In both cases the engine is looking for the same thing — a business whose name appears repeatedly, consistently, and in trustworthy contexts connected to a service and a place.",
          "That means AI visibility is earned through the digital footprint of your business: how often your name co-occurs with your city and your trade, how consistent your information is across the web, and how machine-readable your own website is.",
        ],
      },
      {
        heading: "Step 1 — Make your website answer real customer questions",
        paragraphs: [
          "AI engines love content that directly answers the questions people actually ask them. Create a genuine FAQ page: “How much does a kitchen remodel cost in Austin?”, “Do you handle emergency repairs?”, “Which neighborhoods do you serve?”. Write clear, factual answers of a few sentences each.",
          "Every question you answer on your site is a query where an AI engine can cite you as the source. Thin brochure pages (“We are passionate about quality”) give the model nothing to work with.",
        ],
      },
      {
        heading: "Step 2 — Add LocalBusiness structured data",
        paragraphs: [
          "Structured data (schema.org markup) turns your website from prose into facts a machine can verify: your business name, address, phone, opening hours, services and service area. Engines that retrieve your site at answer time can then confirm you are a real, local, operating business.",
          "At minimum, mark up your name, address, phone number, URL, geo coordinates and opening hours with the LocalBusiness schema type that matches your trade (Plumber, Electrician, Restaurant, RealEstateAgent…).",
        ],
      },
      {
        heading: "Step 3 — Build consistent citations across the web",
        paragraphs: [
          "AI models weigh repetition and consistency. Your business name, address and phone number (NAP) should be identical on Google Business Profile, Yelp, industry directories, your social profiles and local press. Conflicting information erodes the model's confidence in recommending you.",
          "Reviews matter enormously: engines frequently justify recommendations with phrases like “highly rated” or “known for”. A steady stream of detailed reviews that mention your services and city feeds exactly the associations you want the model to learn.",
        ],
      },
      {
        heading: "Step 4 — Measure, then iterate",
        paragraphs: [
          "You can't improve what you don't measure. Run the questions your customers ask through the major AI engines and record whether you're mentioned, who is mentioned instead, and how the answers change over time. Do it weekly — AI answers shift as models and their search indexes update.",
          "That's precisely what GetInTheAnswer automates: it asks the real questions your local customers ask, in their language, measures your mentions against competitors, and turns the gaps into a prioritized action plan.",
        ],
      },
    ],
  },
  {
    slug: "what-is-generative-engine-optimization",
    title: "What Is Generative Engine Optimization (GEO)?",
    metaTitle: "What Is GEO? Generative Engine Optimization Explained (2026)",
    description:
      "Generative Engine Optimization (GEO) is the practice of making your business visible in AI-generated answers. Here's what it is, how it differs from SEO, and how to start.",
    datePublished: "2026-08-17",
    readingMinutes: 6,
    intro: [
      "Generative Engine Optimization (GEO) — sometimes called AI SEO or LLM SEO — is the practice of improving how often and how favorably your business appears in answers generated by AI engines like ChatGPT, Claude, Perplexity and Google's AI Overviews.",
      "Where classic SEO competes for a ranked list of blue links, GEO competes for something scarcer: a handful of names an AI actually says out loud when a customer asks for a recommendation.",
    ],
    sections: [
      {
        heading: "GEO vs SEO: what actually changes",
        paragraphs: [
          "SEO optimizes for a crawler and a ranking algorithm; GEO optimizes for a language model synthesizing an answer. The overlap is real — good content, structured data and authority help both — but the output is different. Page two of Google still gets some clicks. Not being in an AI's three recommended businesses gets you exactly zero.",
          "GEO also has a memory dimension SEO doesn't: models carry associations learned during training. A business with years of consistent citations, reviews and press is embedded in the model itself, not just in a retrievable index.",
        ],
      },
      {
        heading: "Why GEO matters now for local businesses",
        paragraphs: [
          "A rapidly growing share of consumers start (and often end) their search for a service inside an AI assistant. These are high-intent moments: someone asking “who should I hire to remodel my kitchen in Austin?” is ready to buy. The AI's answer is effectively a shortlist — and shortlists convert.",
          "For local businesses this is a land-grab moment. Most competitors haven't started optimizing for AI answers, which means the businesses that build signals now inherit a durable advantage as these habits become mainstream.",
        ],
      },
      {
        heading: "The three pillars of GEO",
        paragraphs: ["Effective GEO work falls into three buckets:"],
        list: [
          "Machine-readable facts — structured data, consistent NAP citations, accurate profiles everywhere your business is listed.",
          "Answer-shaped content — pages that directly answer the questions customers ask AI assistants, in plain language.",
          "Third-party evidence — reviews, local press, directories and community mentions that teach models to associate your name with your trade and your city.",
        ],
      },
      {
        heading: "How to measure GEO",
        paragraphs: [
          "GEO starts with a visibility audit: take the 10–20 questions your customers actually ask, run them through the major AI engines, and score how often you're named versus your competitors. Track it weekly — answers move as models update.",
          "GetInTheAnswer runs this exact audit in minutes and gives you a 0–100 visibility score, the competitors dominating your queries, and a prioritized plan to close the gap.",
        ],
      },
    ],
  },
  {
    slug: "ai-seo-for-local-business",
    title: "AI SEO for Local Businesses: The Practical Playbook",
    metaTitle: "AI SEO for Local Businesses: Practical Playbook (2026)",
    description:
      "The concrete playbook local businesses can follow to show up in ChatGPT, Claude and Perplexity answers: profiles, reviews, content, structured data and measurement.",
    datePublished: "2026-08-17",
    readingMinutes: 8,
    intro: [
      "Your future customers are already asking AI assistants for recommendations — “best dentist near me”, “who can renovate a bathroom in Marseille”, “reliable HVAC company in Phoenix”. This playbook lists, in priority order, what a local business should actually do about it.",
    ],
    sections: [
      {
        heading: "1. Lock down your business profiles",
        paragraphs: [
          "AI engines lean heavily on the sources they trust most for local facts: Google Business Profile, Apple Business Connect, Yelp and the leading directories of your industry. Claim them all, complete every field, and keep name, address, phone and hours perfectly consistent.",
          "Inconsistency is the silent killer of AI visibility — if the model sees three different phone numbers, it recommends the competitor whose facts line up.",
        ],
      },
      {
        heading: "2. Turn reviews into a machine",
        paragraphs: [
          "When AI engines explain a recommendation, they cite reputation: “highly rated for…”, “customers praise…”. Reviews are the training data of those sentences. Build a simple, systematic ask — after every completed job, request a review and encourage customers to mention the specific service and neighborhood.",
          "A review that says “they remodeled our kitchen in Hyde Park beautifully” teaches the model the exact association (service + place + your name) you want it to repeat.",
        ],
      },
      {
        heading: "3. Publish answer-shaped content",
        paragraphs: [
          "Create one page per core service per area you serve, plus an FAQ that mirrors real customer questions. Write like you'd answer a customer on the phone — clear, specific, with prices or ranges where possible. This is the content AI engines quote.",
        ],
      },
      {
        heading: "4. Add structured data",
        paragraphs: [
          "Mark up your site with LocalBusiness schema (name, address, phone, geo, hours, services). It costs an hour of a developer's time and makes every fact about your business verifiable by machines. See our dedicated guide on LocalBusiness schema for the details.",
        ],
      },
      {
        heading: "5. Measure weekly, fix what's broken",
        paragraphs: [
          "Pick the questions that matter for your revenue, run them through ChatGPT, Claude and Perplexity, and score yourself against the competitors the engines actually name. Repeat weekly and watch the trend — that's your AI visibility, measured where customers really are.",
          "GetInTheAnswer automates this loop: real queries in your customers' language, a 0–100 score, named competitors, and a prioritized action plan updated with weekly re-scans.",
        ],
      },
    ],
  },
  {
    slug: "localbusiness-schema-ai-visibility",
    title: "LocalBusiness Schema: Structured Data That Makes AI Trust Your Business",
    metaTitle: "LocalBusiness Schema for AI Visibility: Complete Guide (2026)",
    description:
      "How LocalBusiness structured data helps ChatGPT, Perplexity and Google's AI verify and recommend your business — with a copy-paste JSON-LD example.",
    datePublished: "2026-08-17",
    readingMinutes: 5,
    intro: [
      "Structured data is the difference between an AI engine reading your website and an AI engine trusting it. LocalBusiness schema turns your key facts — who you are, where you are, what you do, when you're open — into a format machines can verify instantly.",
    ],
    sections: [
      {
        heading: "Why structured data matters for AI answers",
        paragraphs: [
          "When an AI engine retrieves your website while composing an answer, it has seconds to decide whether you're a credible recommendation. Marked-up facts (address, phone, hours, service area) can be verified and cross-checked against directories; prose has to be interpreted. Verifiable businesses are safer to recommend, and engines behave accordingly.",
          "Google's AI Overviews and Perplexity, which retrieve live pages, benefit most directly. But consistent structured facts also flow into the datasets future models train on — today's markup is next year's model memory.",
        ],
      },
      {
        heading: "What to include, minimum viable markup",
        paragraphs: ["A solid LocalBusiness JSON-LD block includes:"],
        list: [
          "@type — the most specific type that fits (Plumber, Dentist, Restaurant, RealEstateAgent…), not just LocalBusiness",
          "name, url, telephone — exactly matching your Google Business Profile",
          "address (PostalAddress) and geo coordinates",
          "openingHoursSpecification",
          "areaServed — the cities and neighborhoods you cover",
          "description mentioning your core services",
        ],
      },
      {
        heading: "Copy-paste example",
        paragraphs: [
          "Adapt this JSON-LD and place it in a <script type=\"application/ld+json\"> tag on your homepage: {\"@context\":\"https://schema.org\",\"@type\":\"Plumber\",\"name\":\"Smith Plumbing Co.\",\"url\":\"https://smithplumbing.com\",\"telephone\":\"+1-512-555-0100\",\"address\":{\"@type\":\"PostalAddress\",\"streetAddress\":\"100 Main St\",\"addressLocality\":\"Austin\",\"addressRegion\":\"TX\",\"postalCode\":\"78701\",\"addressCountry\":\"US\"},\"geo\":{\"@type\":\"GeoCoordinates\",\"latitude\":30.2672,\"longitude\":-97.7431},\"openingHoursSpecification\":[{\"@type\":\"OpeningHoursSpecification\",\"dayOfWeek\":[\"Monday\",\"Tuesday\",\"Wednesday\",\"Thursday\",\"Friday\"],\"opens\":\"08:00\",\"closes\":\"18:00\"}],\"areaServed\":\"Austin, TX\"}",
          "Validate it with Google's Rich Results Test, then keep it in sync whenever your hours or services change.",
        ],
      },
      {
        heading: "Does it actually move your AI visibility?",
        paragraphs: [
          "Structured data alone won't make an AI recommend you — reputation and content do the heavy lifting. But it removes doubt at the exact moment an engine decides whether you're safe to name. In our scans, businesses with complete, consistent markup are disproportionately represented in retrieval-backed answers.",
          "Measure the effect yourself: run a free GetInTheAnswer scan before and a few weeks after adding markup, and watch your mention rate.",
        ],
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

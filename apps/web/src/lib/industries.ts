export interface IndustryRankingFactor {
  title: string;
  description: string;
}

export interface IndustryActionStep {
  title: string;
  description: string;
  impact: string;
}

export interface IndustryFAQ {
  question: string;
  answer: string;
}

export interface Industry {
  slug: string;
  name: string;
  singularName: string;
  metaTitle: string;
  metaDescription: string;
  heroSubtitle: string;
  schemaType: string;
  sampleQueries: string[];
  rankingFactors: IndustryRankingFactor[];
  actionSteps: IndustryActionStep[];
  faq: IndustryFAQ[];
}

export const industries: Industry[] = [
  {
    slug: "plumbers",
    name: "Plumbing Contractors & Plumbers",
    singularName: "Plumber",
    metaTitle: "AI SEO for Plumbers: How to Get Recommended by ChatGPT & Perplexity",
    metaDescription:
      "Actionable guide to optimizing your plumbing business for ChatGPT, Claude, Gemini, and Perplexity recommendations. Boost your local AI visibility score today.",
    heroSubtitle:
      "When homeowners ask ChatGPT “who is the best emergency plumber near me?”, make sure your plumbing company is the #1 recommendation.",
    schemaType: "Plumber",
    sampleQueries: [
      "Who is the most reliable emergency plumber in {city} for a burst pipe?",
      "Which plumbing company offers 24/7 leak detection and drain cleaning in {city}?",
      "Average cost of a tankless water heater installation and recommended plumbers in {city}",
      "Top-rated commercial plumbers for restaurant drainage in {city}",
    ],
    rankingFactors: [
      {
        title: "24/7 Availability & Emergency Signals",
        description:
          "AI engines prioritize plumbers with explicit emergency hours, fast response claims, and consistent licensing across all directories.",
      },
      {
        title: "Service-Specific Review Mentions",
        description:
          "Reviews explicitly mentioning services (e.g., 'fixed our slab leak', 'cleared main sewer line') build strong semantic associations in LLMs.",
      },
      {
        title: "Local Schema Markup (Plumber)",
        description:
          "Direct JSON-LD schema with service areas, emergency hours, and phone numbers gives AI crawlers verifiable facts.",
      },
    ],
    actionSteps: [
      {
        title: "Add Plumber Schema Markup",
        description: "Embed JSON-LD with opening hours, emergency status, and service areas.",
        impact: "+15% AI Citations",
      },
      {
        title: "Publish an Emergency Plumbing FAQ",
        description: "Answer real local questions regarding pricing, response times, and permits.",
        impact: "+20% Query Matching",
      },
      {
        title: "Standardize Google Business & Yelp Profiles",
        description: "Align NAP (Name, Address, Phone) data perfectly to eliminate AI ambiguity.",
        impact: "+10% Trust Factor",
      },
    ],
    faq: [
      {
        question: "Why doesn't ChatGPT recommend my plumbing company?",
        answer:
          "ChatGPT recommends businesses with strong, verified digital signals. If your site lacks structured schema, answers to common pricing questions, or consistent directory listings, the AI defaults to competitors.",
      },
      {
        question: "How can plumbers measure their AI visibility?",
        answer:
          "You can run an automated scan with GetInTheAnswer. We test 10 realistic plumbing queries across ChatGPT, Claude, Gemini, and Perplexity and benchmark you against local competitors.",
      },
    ],
  },
  {
    slug: "dentists",
    name: "Dental Clinics & Orthodontists",
    singularName: "Dentist",
    metaTitle: "AI SEO for Dentists: Getting Recommended by ChatGPT & Claude",
    metaDescription:
      "Learn how dental practices, cosmetic dentists, and orthodontists can dominate ChatGPT, Claude, and Perplexity local search recommendations.",
    heroSubtitle:
      "When patients ask AI assistants for dental implant specialists or top-rated dentists in your city, win the recommendation.",
    schemaType: "Dentist",
    sampleQueries: [
      "Best cosmetic dentist for porcelain veneers in {city}",
      "Where can I find an emergency pediatric dentist open on weekends in {city}?",
      "Cost of Invisalign vs braces and top orthodontists in {city}",
      "Gentle dental clinic with great sedation dentistry reviews in {city}",
    ],
    rankingFactors: [
      {
        title: "Doctor Credentials & Specialties",
        description:
          "AI models look for DDS/DMD certifications, board associations, and clear descriptions of cosmetic or orthodontic specialties.",
      },
      {
        title: "Insurance & Financing Clarity",
        description:
          "Patients frequently ask AI about accepted insurances and payment plans; having this indexed makes your practice quotable.",
      },
      {
        title: "Patient Experience & Gentle Care Signals",
        description:
          "Mentions of painless procedures, friendly staff, and clean modern facilities in reviews are heavily cited by AI engines.",
      },
    ],
    actionSteps: [
      {
        title: "Deploy Dentist Schema with MedicalSpecialty",
        description: "Tag your practice with Dentist, Orthodontics, or Pediatric Dentistry schema.",
        impact: "+18% AI Relevance",
      },
      {
        title: "Create Treatment & Pricing Guides",
        description: "Provide transparent price ranges and procedure walkthroughs on your site.",
        impact: "+25% AI Citations",
      },
      {
        title: "Encourage Specialty-Focused Reviews",
        description: "Prompt patients to mention specific treatments like Invisalign or dental implants.",
        impact: "+15% Recommendation Rate",
      },
    ],
    faq: [
      {
        question: "Do AI engines read dentist reviews before recommending them?",
        answer:
          "Yes. Perplexity and ChatGPT search models extract review summaries to justify recommendations, citing phrases like 'highly rated for cosmetic care' or 'patients praise their painless technique'.",
      },
      {
        question: "What is the best schema type for dental practices?",
        answer:
          "Use Schema.org/Dentist, and specify medicalSpecialty (e.g., Orthodontic, Cosmetic, Pediatric) alongside your accepted insurance providers and doctors.",
      },
    ],
  },
  {
    slug: "lawyers",
    name: "Law Firms & Attorneys",
    singularName: "Lawyer",
    metaTitle: "AI SEO for Law Firms: Dominate ChatGPT & AI Search Recommendations",
    metaDescription:
      "How personal injury, family, criminal defense, and business lawyers can get cited and recommended by generative AI engines.",
    heroSubtitle:
      "When prospective clients ask ChatGPT for legal representation, ensure your law firm is named as the trusted authority.",
    schemaType: "Attorney",
    sampleQueries: [
      "Top personal injury lawyer in {city} with a proven track record",
      "Best family law attorney for contested divorce in {city}",
      "Experienced criminal defense lawyer for DUI cases in {city}",
      "Corporate business litigation attorney near me in {city}",
    ],
    rankingFactors: [
      {
        title: "Case Results & Settlement Transparency",
        description:
          "Verified settlement figures and case outcomes establish strong authority signals that LLMs reference when recommending counsel.",
      },
      {
        title: "State Bar & Practice Area Verification",
        description:
          "Consistent attorney licensing, bar association memberships, and recognized legal directories (Avvo, Justia, Martindale).",
      },
      {
        title: "Direct Answers to Legal FAQ",
        description:
          "Websites with comprehensive answers to statute of limitations, fee structures, and legal procedures get cited as authoritative sources.",
      },
    ],
    actionSteps: [
      {
        title: "Implement LegalService & Attorney Schema",
        description: "Add schema data detailing practice areas, attorney names, and jurisdictions.",
        impact: "+20% Authority Score",
      },
      {
        title: "Build Practice Area FAQ Hubs",
        description: "Answer high-intent client questions (e.g. 'What to do after a car accident in {city}').",
        impact: "+30% AI Answer Inclusions",
      },
      {
        title: "Unify Legal Directory Profiles",
        description: "Synchronize Avvo, Justia, Google Business, and website attorney bios.",
        impact: "+15% Verification Confidence",
      },
    ],
    faq: [
      {
        question: "Can an AI give legal recommendations?",
        answer:
          "AI assistants often disclaim legal advice but regularly provide curated lists of reputable law firms and attorneys when asked for local recommendations.",
      },
      {
        question: "How does GEO differ from traditional legal SEO?",
        answer:
          "While traditional SEO focuses on keyword stuffing and backlinks for blue links, GEO focuses on establishing entity authority, structured practice details, and machine-readable case evidence.",
      },
    ],
  },
  {
    slug: "real-estate-agents",
    name: "Real Estate Agents & Brokerages",
    singularName: "Real Estate Agent",
    metaTitle: "AI SEO for Real Estate Agents: ChatGPT & Perplexity Optimization",
    metaDescription:
      "Discover how real estate agents and brokerages can rank in AI recommendations when buyers and sellers search in their city or neighborhood.",
    heroSubtitle:
      "When buyers and sellers ask AI assistants for the top real estate agent in your area, be the name they trust.",
    schemaType: "RealEstateAgent",
    sampleQueries: [
      "Who is the best real estate agent to sell a luxury home in {city}?",
      "Top-rated buyer's agent specializing in historic neighborhoods in {city}",
      "Recommended real estate brokerage for first-time home buyers in {city}",
      "Which realtor has the most verified sales in {city} this year?",
    ],
    rankingFactors: [
      {
        title: "Neighborhood & Hyperlocal Authority",
        description:
          "AI models prioritize agents who demonstrate deep expertise in specific subdivisions, school districts, and zip codes.",
      },
      {
        title: "Transaction History & Client Testimonials",
        description:
          "Reviews detailing successful sales above asking price or smooth negotiation experiences feed AI recommendation logic.",
      },
      {
        title: "Zillow, Realtor.com & Google Profile Sync",
        description:
          "Consistency between major MLS portals and your personal website confirms active listing status.",
      },
    ],
    actionSteps: [
      {
        title: "Add RealEstateAgent Schema with areaServed",
        description: "Specify exact neighborhoods, cities, and zip codes in your structured data.",
        impact: "+22% Local Relevance",
      },
      {
        title: "Publish Neighborhood Market Reports",
        description: "Create quarterly market stats and buyer guides that AI models can quote.",
        impact: "+25% Source Citations",
      },
      {
        title: "Gather Hyperlocal Reviews",
        description: "Ask clients to name the exact community or neighborhood in their review.",
        impact: "+18% Query Matching",
      },
    ],
    faq: [
      {
        question: "How do AI models know which real estate agents are active?",
        answer:
          "AI search engines crawl public MLS data, Zillow/Realtor profile mentions, local press, and updated market commentary on your website.",
      },
      {
        question: "Why should realtors optimize for GEO now?",
        answer:
          "High-net-worth buyers and relocating families increasingly use AI to research agents before reaching out. Optimizing now gives you a first-mover advantage in your market.",
      },
    ],
  },
  {
    slug: "restaurants",
    name: "Restaurants, Bistros & Cafes",
    singularName: "Restaurant",
    metaTitle: "AI SEO for Restaurants: How to Get Recommended by ChatGPT & Gemini",
    metaDescription:
      "Get your restaurant recommended when diners ask ChatGPT, Claude, and Gemini for the best dining, brunch, or romantic spots in town.",
    heroSubtitle:
      "When foodies ask AI “where should we go for dinner tonight?”, get your restaurant served in the top 3 recommendations.",
    schemaType: "Restaurant",
    sampleQueries: [
      "Best romantic Italian restaurant with outdoor seating in {city}",
      "Where can I find authentic gluten-free pizza in {city}?",
      "Top-rated brunch spots with craft cocktails in {city}",
      "Kid-friendly restaurants with private dining rooms in {city}",
    ],
    rankingFactors: [
      {
        title: "Cuisine & Dietary Tag Consistency",
        description:
          "Clear menu tags (vegan, gluten-free, halal, farm-to-table) make your restaurant appear for specific dietary queries.",
      },
      {
        title: "Menu Item Mentions in Reviews",
        description:
          "AI models extract signature dishes (e.g. 'their truffle pasta is incredible') to recommend specific cravings.",
      },
      {
        title: "Schema.org/Restaurant with Menu Link",
        description:
          "Structured data linking directly to machine-readable menu items, reservations, and price ranges.",
      },
    ],
    actionSteps: [
      {
        title: "Add Restaurant Schema with hasMenu & servesCuisine",
        description: "Structure your menu items, opening hours, and cuisine classifications.",
        impact: "+30% Dietary Query Match",
      },
      {
        title: "Connect OpenTable / Resy / Google Reserve",
        description: "Allow AI agents to identify direct booking capability.",
        impact: "+15% Conversion Rate",
      },
      {
        title: "Highlight Signature Dishes on Your Site",
        description: "Create dedicated sections for must-try dishes and customer favorites.",
        impact: "+20% AI Recommendation Rate",
      },
    ],
    faq: [
      {
        question: "How does ChatGPT choose which restaurants to suggest?",
        answer:
          "ChatGPT synthesizes recommendations from food blogs, TripAdvisor, Google Reviews, Yelp, and your website's structured menu information.",
      },
      {
        question: "What is the biggest mistake restaurants make with AI visibility?",
        answer:
          "Uploading menus only as non-searchable PDF files or images. AI engines need plain text and structured schema to parse your culinary offerings.",
      },
    ],
  },
  {
    slug: "hvac-contractors",
    name: "HVAC Contractors & AC Repair",
    singularName: "HVAC Contractor",
    metaTitle: "AI SEO for HVAC Contractors: ChatGPT & Perplexity Visibility",
    metaDescription:
      "Master generative engine optimization for heating, ventilation, and air conditioning companies. Get recommended for emergency AC and furnace repair.",
    heroSubtitle:
      "When homeowners face a broken air conditioner or furnace, ensure AI assistants name your HVAC business first.",
    schemaType: "HVACBusiness",
    sampleQueries: [
      "Who offers 24/7 emergency AC repair near me in {city}?",
      "Average cost of central heat pump installation and top HVAC contractors in {city}",
      "Best commercial refrigeration and heating maintenance company in {city}",
      "Reliable ductless mini-split installers in {city}",
    ],
    rankingFactors: [
      {
        title: "Brand Authorization & Certifications",
        description:
          "NATE certification, Carrier/Trane/Lennox factory authorization signals give AI confidence in technical proficiency.",
      },
      {
        title: "Seasonal Query Responsiveness",
        description:
          "Web content addressing seasonal spikes (summer AC breakdowns, winter furnace tune-ups) gets quoted during peak demand.",
      },
      {
        title: "HVACBusiness Schema with Emergency Details",
        description:
          "Explicit service areas, financing availability, and warranty terms structured for search bots.",
      },
    ],
    actionSteps: [
      {
        title: "Deploy HVACBusiness Structured Data",
        description: "Add schema covering furnace repair, AC maintenance, heat pumps, and ductwork.",
        impact: "+18% AI Accuracy",
      },
      {
        title: "Publish Seasonal Maintenance Guides",
        description: "Provide DIY troubleshooting vs when to call a pro to establish authority.",
        impact: "+22% Search Quotations",
      },
      {
        title: "Streamline Directory Information",
        description: "Keep hours, licensing, and emergency service terms aligned across all platforms.",
        impact: "+12% Trust Ranking",
      },
    ],
    faq: [
      {
        question: "Can AI help generate leads for HVAC companies?",
        answer:
          "Yes. More homeowners now ask AI assistants for immediate contractor recommendations rather than wading through sponsored search ads.",
      },
      {
        question: "How often should an HVAC business test its AI visibility?",
        answer:
          "We recommend weekly tracking, especially before summer and winter peaks when consumer query volumes surge.",
      },
    ],
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((industry) => industry.slug === slug);
}

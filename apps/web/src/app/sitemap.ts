import type { MetadataRoute } from "next";

import { guides } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/onboarding`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/guides`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...["legal", "privacy", "terms"].map((page) => ({
      url: `${SITE_URL}/${page}`,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
    ...guides.map((guide) => ({
      url: `${SITE_URL}/guides/${guide.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}

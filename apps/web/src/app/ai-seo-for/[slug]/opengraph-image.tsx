import { ImageResponse } from "next/og";
import { getIndustry } from "@/lib/industries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = getIndustry(slug);

  const title = industry ? `AI SEO for ${industry.name}` : "AI SEO Industry Playbook";
  const singular = industry ? industry.singularName : "Local Business";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#173b35",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <svg viewBox="0 0 48 48" width="56" height="56">
              <rect x="3" y="3" width="42" height="36" rx="12" fill="#bef264" />
              <path d="M11 35 L11 45.6 C11 47.5 12.7 47 13.7 46 L23.5 37 Z" fill="#bef264" />
              <rect x="11.75" y="23" width="5.5" height="8" rx="2.75" fill="#173b35" opacity="0.35" />
              <rect x="21.25" y="17.5" width="5.5" height="13.5" rx="2.75" fill="#173b35" opacity="0.65" />
              <rect x="30.75" y="11" width="5.5" height="20" rx="2.75" fill="#173b35" />
            </svg>
            <div style={{ color: "#ffffff", fontSize: 38, fontWeight: 800, letterSpacing: -1.5 }}>GetInTheAnswer</div>
          </div>
          <div
            style={{
              background: "rgba(190, 242, 100, 0.15)",
              color: "#bef264",
              fontSize: 22,
              fontWeight: 800,
              padding: "10px 24px",
              borderRadius: 999,
              border: "1px solid rgba(190, 242, 100, 0.3)",
            }}
          >
            {singular} · Playbook
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              color: "#bef264",
              fontSize: 24,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            Generative Engine Optimization (GEO)
          </div>
          <div
            style={{
              color: "#ffffff",
              fontSize: 58,
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1.1,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: 24 }}>
            Get recommended by ChatGPT, Claude &amp; Perplexity
          </div>
          <div
            style={{
              display: "flex",
              background: "#bef264",
              color: "#173b35",
              fontSize: 24,
              fontWeight: 800,
              padding: "12px 30px",
              borderRadius: 999,
            }}
          >
            getintheanswer.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

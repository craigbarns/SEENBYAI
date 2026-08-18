"""Fetch a business website and check the signals AI engines rely on.

Two tiers: a plain HTTP fetch first (free, no dependency), then Firecrawl for
sites the plain fetch can't read (JS-rendered pages, bot protection).
"""

import asyncio
import ipaddress
import json
import os
import re
import socket
from typing import List, Optional
from urllib.parse import urljoin, urlsplit

import httpx
from pydantic import BaseModel, Field

FIRECRAWL_API_KEY = os.getenv("FIRECRAWL_API_KEY", "").strip()
FIRECRAWL_ENDPOINT = "https://api.firecrawl.dev/v2/scrape"
BROWSER_USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
)
# Below this, a page is almost certainly a JS shell rather than real content.
MIN_USEFUL_TEXT = 600
MAX_RESPONSE_BYTES = 2_000_000
MAX_REDIRECTS = 5
ALLOWED_PORTS = {80, 443}

LOCAL_BUSINESS_TYPES = {
    "localbusiness", "restaurant", "store", "plumber", "electrician", "dentist",
    "realestateagent", "hotel", "lodgingbusiness", "homeandconstructionbusiness",
    "professionalservice", "medicalbusiness", "healthandbeautybusiness",
    "automotivebusiness", "foodestablishment", "legalservice", "financialservice",
    "generalcontractor", "roofingcontractor", "hvacbusiness", "movingcompany",
    "childcare", "entertainmentbusiness", "sportsactivitylocation", "travelagency",
}


class SiteCheck(BaseModel):
    key: str
    label: str
    passed: bool
    detail: str


class SiteAudit(BaseModel):
    url: str
    fetched: bool
    source: str = "none"  # "http" | "firecrawl" | "none"
    checks: List[SiteCheck] = Field(default_factory=list)
    content_digest: Optional[str] = None


class UnsafeWebsiteUrl(ValueError):
    """Raised when a submitted website could reach a private network target."""


def validate_url_structure(url: str) -> tuple[str, int]:
    parsed = urlsplit(url)
    if parsed.scheme not in {"http", "https"} or not parsed.hostname:
        raise UnsafeWebsiteUrl("Only public http and https websites can be analyzed.")
    if parsed.username or parsed.password:
        raise UnsafeWebsiteUrl("Website addresses containing credentials are not supported.")

    try:
        port = parsed.port or (443 if parsed.scheme == "https" else 80)
    except ValueError as exc:
        raise UnsafeWebsiteUrl("The website port is invalid.") from exc
    if port not in ALLOWED_PORTS:
        raise UnsafeWebsiteUrl("Only standard website ports (80 and 443) can be analyzed.")

    hostname = parsed.hostname.rstrip(".").lower()
    if (
        hostname == "localhost"
        or hostname.endswith((".localhost", ".local", ".internal"))
    ):
        raise UnsafeWebsiteUrl("Private or local network addresses cannot be analyzed.")
    return hostname, port


async def validate_public_http_url(url: str) -> None:
    """Resolve a URL and reject every private, loopback or reserved address."""

    hostname, port = validate_url_structure(url)
    try:
        literal_ip = ipaddress.ip_address(hostname)
        addresses = {literal_ip}
    except ValueError:
        try:
            resolved = await asyncio.to_thread(
                socket.getaddrinfo,
                hostname,
                port,
                type=socket.SOCK_STREAM,
            )
        except OSError as exc:
            raise UnsafeWebsiteUrl("The website hostname could not be resolved.") from exc
        addresses = {
            ipaddress.ip_address(address[4][0].split("%", 1)[0])
            for address in resolved
        }

    if not addresses or any(not address.is_global for address in addresses):
        raise UnsafeWebsiteUrl("Private or local network addresses cannot be analyzed.")


def strip_html(html: str) -> str:
    without_blocks = re.sub(
        r"<(script|style|noscript|template)\b[^>]*>.*?</\1>", " ", html, flags=re.I | re.S
    )
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", without_blocks)).strip()


def extract_json_ld(html: str) -> List[dict]:
    blocks: List[dict] = []
    for match in re.finditer(
        r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        html,
        flags=re.I | re.S,
    ):
        try:
            parsed = json.loads(match.group(1).strip())
        except Exception:
            continue
        candidates = parsed if isinstance(parsed, list) else [parsed]
        for candidate in candidates:
            if isinstance(candidate, dict):
                blocks.append(candidate)
                graph = candidate.get("@graph")
                if isinstance(graph, list):
                    blocks.extend(item for item in graph if isinstance(item, dict))
    return blocks


def schema_types(blocks: List[dict]) -> set:
    found = set()
    for block in blocks:
        raw_type = block.get("@type")
        values = raw_type if isinstance(raw_type, list) else [raw_type]
        found.update(str(value).lower() for value in values if value)
    return found


async def fetch_via_http(url: str) -> Optional[str]:
    try:
        async with httpx.AsyncClient(
            follow_redirects=False,
            timeout=20,
            headers={"User-Agent": BROWSER_USER_AGENT},
        ) as client:
            current_url = url
            for _ in range(MAX_REDIRECTS + 1):
                # Validate every redirect target, not just the user-supplied URL.
                await validate_public_http_url(current_url)
                async with client.stream("GET", current_url) as response:
                    if response.is_redirect:
                        location = response.headers.get("location")
                        if not location:
                            return None
                        current_url = urljoin(current_url, location)
                        continue
                    if response.status_code >= 400:
                        return None
                    content_type = response.headers.get("content-type", "").lower()
                    if content_type and not any(
                        allowed in content_type
                        for allowed in ("text/html", "application/xhtml+xml", "text/plain")
                    ):
                        return None

                    content = bytearray()
                    async for chunk in response.aiter_bytes():
                        content.extend(chunk)
                        if len(content) > MAX_RESPONSE_BYTES:
                            return None
                    return bytes(content).decode(response.encoding or "utf-8", errors="replace")
            return None
    except (httpx.HTTPError, UnicodeError, UnsafeWebsiteUrl):
        return None


async def fetch_via_firecrawl(url: str) -> Optional[str]:
    if not FIRECRAWL_API_KEY:
        return None
    try:
        async with httpx.AsyncClient(timeout=90) as client:
            response = await client.post(
                FIRECRAWL_ENDPOINT,
                headers={"Authorization": f"Bearer {FIRECRAWL_API_KEY}"},
                json={"url": url, "formats": ["rawHtml"], "onlyMainContent": False},
            )
            if response.status_code >= 400:
                return None
            data = (response.json() or {}).get("data") or {}
            return data.get("rawHtml") or None
    except Exception:
        return None


def build_checks(html: str, city: str, industry: str, services: str) -> List[SiteCheck]:
    text = strip_html(html)
    lowered = text.lower()
    blocks = extract_json_ld(html)
    types = schema_types(blocks)

    local_types = types & LOCAL_BUSINESS_TYPES
    if local_types:
        schema_detail = f"Found {', '.join(sorted(local_types))} structured data — AI engines can verify your business facts."
    elif types:
        schema_detail = (
            f"Structured data present ({', '.join(sorted(types)[:3])}) but no LocalBusiness type — "
            "engines can't verify your address, hours or service area."
        )
    else:
        schema_detail = "No structured data found — engines have no machine-readable facts to verify."

    city_token = city.strip().lower()
    city_hit = bool(city_token) and city_token in lowered

    faq_hit = bool(
        types & {"faqpage", "question"}
        or re.search(r"\b(faq|frequently asked|questions? fr[ée]quentes?|preguntas frecuentes)\b", lowered)
    )

    phone_hit = bool(re.search(r"(\+\d[\d ().-]{7,}\d)|(\(\d{3}\)\s?\d{3}[-.\s]?\d{4})", text))
    address_hit = bool(
        types & {"postaladdress"}
        or re.search(r"\b\d{5}\b", text)
        or re.search(r"\b\d+\s+[A-Za-zÀ-ÿ'’.-]+\s+(street|st|avenue|ave|road|rd|boulevard|blvd|rue|chemin|route|impasse|allée)\b", lowered)
    )

    service_terms = [
        term.strip().lower()
        for term in re.split(r"[,;/]", services or industry)
        if len(term.strip()) > 3
    ][:4]
    service_hits = [term for term in service_terms if term in lowered]

    return [
        SiteCheck(
            key="local_business_schema",
            label="LocalBusiness structured data",
            passed=bool(local_types),
            detail=schema_detail,
        ),
        SiteCheck(
            key="city_mentioned",
            label=f"Your city ({city.strip().title()}) named on the page",
            passed=city_hit,
            detail=(
                f"“{city.strip().title()}” appears in your page text, tying your business to the local market."
                if city_hit
                else f"“{city.strip().title()}” doesn't appear in your page text — engines can't tie you to the local market consumers ask about."
            ),
        ),
        SiteCheck(
            key="faq_content",
            label="FAQ / answer-shaped content",
            passed=faq_hit,
            detail=(
                "Your site answers customer questions directly — this is the content engines quote."
                if faq_hit
                else "No FAQ or question-and-answer content found. This is the single highest-impact page to add: every question you answer is a query an engine can cite you for."
            ),
        ),
        SiteCheck(
            key="nap_visible",
            label="Contact details (phone & address) visible",
            passed=phone_hit and address_hit,
            detail=(
                "Phone number and address are both visible on the page."
                if phone_hit and address_hit
                else (
                    "A phone number is visible but no clear postal address — engines cross-check both."
                    if phone_hit
                    else (
                        "An address is visible but no phone number — engines cross-check both."
                        if address_hit
                        else "Neither a phone number nor a postal address is visible on the page — these are the facts engines cross-check against directories."
                    )
                )
            ),
        ),
        SiteCheck(
            key="services_described",
            label="Core services described in text",
            passed=bool(service_hits),
            detail=(
                f"Your page text mentions {', '.join(service_hits)}."
                if service_hits
                else "Your core services aren't described in the page text — engines have nothing to match consumer intent against."
            ),
        ),
    ]


async def audit_site(url: str, city: str, industry: str, services: str) -> SiteAudit:
    html = await fetch_via_http(url)
    source = "http"
    if not html or len(strip_html(html)) < MIN_USEFUL_TEXT:
        firecrawl_html = await fetch_via_firecrawl(url)
        if firecrawl_html:
            html, source = firecrawl_html, "firecrawl"

    if not html:
        return SiteAudit(url=url, fetched=False, source="none")

    checks = build_checks(html, city, industry, services)
    digest = "; ".join(
        f"{check.label}: {'PASS' if check.passed else 'FAIL'} ({check.detail})" for check in checks
    )
    text = strip_html(html)
    return SiteAudit(
        url=url,
        fetched=True,
        source=source,
        checks=checks,
        content_digest=f"{digest}\n\nPage text excerpt: {text[:1500]}",
    )

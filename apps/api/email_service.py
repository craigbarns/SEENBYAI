"""Transactional email via Resend's REST API.

No-ops entirely when RESEND_API_KEY is unset, matching the pattern used for
every other optional integration in this app (Anthropic, Perplexity, Gemini,
Firecrawl): the product works without it, and it activates the moment the
env var is set — no redeploy-time branching needed.
"""

import os
from html import escape
from typing import Optional

import httpx

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "").strip()
FROM_ADDRESS = os.getenv("RESEND_FROM_ADDRESS", "GetInTheAnswer <reports@getintheanswer.com>")
NOTIFY_ADDRESS = os.getenv("NOTIFY_EMAIL", "").strip()

RESEND_ENDPOINT = "https://api.resend.com/emails"


async def send_email(to: str, subject: str, html: str, reply_to: Optional[str] = None) -> bool:
    if not RESEND_API_KEY:
        return False
    try:
        payload = {"from": FROM_ADDRESS, "to": [to], "subject": subject, "html": html}
        if reply_to:
            payload["reply_to"] = reply_to

        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.post(
                RESEND_ENDPOINT,
                headers={"Authorization": f"Bearer {RESEND_API_KEY}"},
                json=payload,
            )
            return response.status_code < 400
    except Exception:
        return False


def agency_inquiry_email(
    full_name: str,
    work_email: str,
    company_name: str,
    website_url: Optional[str],
    location_count: int,
    message: Optional[str],
) -> tuple[str, str]:
    safe_company = " ".join(company_name.split())
    subject = f"Agency inquiry: {safe_company} ({location_count} locations)"

    def safe(value: Optional[str], fallback: str = "Not provided") -> str:
        if not value or not value.strip():
            return fallback
        return escape(value.strip()).replace("\n", "<br>")

    website = safe(website_url)
    website_row = (
        f'<a href="{website}" rel="noreferrer">{website}</a>'
        if website_url
        else website
    )
    html = f"""
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:620px;color:#173b35;">
      <div style="background:#173b35;padding:24px 28px;border-radius:16px 16px 0 0;">
        <span style="color:#bef264;font-weight:800;font-size:20px;">GetInTheAnswer</span>
      </div>
      <div style="background:#f8f8f3;padding:28px;border-radius:0 0 16px 16px;">
        <h1 style="font-size:22px;margin:0 0 20px;">New agency inquiry</h1>
        <table style="border-collapse:collapse;width:100%;line-height:1.5;">
          <tr><td style="padding:6px 16px 6px 0;color:#66736f;">Name</td><td><b>{safe(full_name)}</b></td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#66736f;">Work email</td><td>{safe(work_email)}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#66736f;">Company</td><td>{safe(company_name)}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#66736f;">Locations</td><td>{location_count}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#66736f;">Website</td><td>{website_row}</td></tr>
        </table>
        <div style="margin-top:22px;padding-top:20px;border-top:1px solid #dfe4dc;">
          <p style="margin:0 0 8px;color:#66736f;">Goals or context</p>
          <p style="margin:0;line-height:1.65;">{safe(message)}</p>
        </div>
        <p style="margin:24px 0 0;font-size:13px;color:#66736f;">Reply to this email to answer the prospect directly.</p>
      </div>
    </div>
    """
    return subject, html


def report_ready_email(company_name: str, dashboard_url: str) -> tuple[str, str]:
    subject = f"Your AI visibility report for {company_name} is ready"
    html = f"""
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;color:#111;">
      <div style="background:#173b35;padding:28px 32px;border-radius:16px 16px 0 0;">
        <span style="color:#bef264;font-weight:800;font-size:20px;">GetInTheAnswer</span>
      </div>
      <div style="background:#f8f8f3;padding:32px;border-radius:0 0 16px 16px;">
        <h1 style="font-size:22px;margin:0 0 12px;">Your report for {company_name} is ready</h1>
        <p style="line-height:1.6;color:#444;">
          We asked ChatGPT, Claude, Gemini and Perplexity the questions your customers actually ask.
          Here's what they said about {company_name} — and who they recommended instead.
        </p>
        <a href="{dashboard_url}" style="display:inline-block;margin-top:16px;background:#173b35;color:#bef264;
           padding:14px 24px;border-radius:999px;text-decoration:none;font-weight:800;">
          View your report
        </a>
        <p style="margin-top:28px;font-size:13px;color:#888;">
          This link is private to you — keep it handy, it always points to your latest results.
        </p>
      </div>
    </div>
    """
    return subject, html


def notify_scan_completed_email(
    company_name: str, requester_email: str, city: str, industry: str, score: int, mode: str, dashboard_url: str
) -> tuple[str, str]:
    subject = f"New scan: {company_name} ({city}) — score {score}/100"
    html = f"""
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;">
      <h2>New GetInTheAnswer scan</h2>
      <table style="border-collapse:collapse;">
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Company</td><td><b>{company_name}</b></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Email</td><td>{requester_email}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">City / Industry</td><td>{city} · {industry}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Score</td><td><b>{score}/100</b></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Mode</td><td>{mode}</td></tr>
      </table>
      <p><a href="{dashboard_url}">View this report →</a></p>
    </div>
    """
    return subject, html

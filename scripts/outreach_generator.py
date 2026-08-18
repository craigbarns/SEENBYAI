#!/usr/bin/env python3
"""
Automated Outbound Sales Generator for GetInTheAnswer
Generates live AI visibility audits and personalized cold emails for US prospects.

Usage:
  python3 scripts/outreach_generator.py
"""

import json
import urllib.request
import urllib.error

API_URL = "https://www.getintheanswer.com/api/onboarding"
DASHBOARD_BASE = "https://www.getintheanswer.com/dashboard"

# Example batch of high-value prospects
PROSPECTS = [
  {
    "companyName": "Austin Dental Spa",
    "websiteUrl": "https://austindentalspa.com",
    "email": "contact@austindentalspa.com",
    "city": "Austin, TX",
    "industry": "Dentist",
    "ownerName": "Dr. Smith",
  },
  {
    "companyName": "Radiant Plumbing & Air Conditioning",
    "websiteUrl": "https://radiantplumbing.com",
    "email": "service@radiantplumbing.com",
    "city": "Austin, TX",
    "industry": "Plumber",
    "ownerName": "Brad",
  },
  {
    "companyName": "Miami Luxury Real Estate LLC",
    "websiteUrl": "https://miamiluxuryhomes.com",
    "email": "info@miamiluxuryhomes.com",
    "city": "Miami, FL",
    "industry": "Real Estate Agent",
    "ownerName": "Michael",
  }
]

def run_scan(prospect):
    payload = {
        "companyName": prospect["companyName"],
        "websiteUrl": prospect["websiteUrl"],
        "email": prospect["email"],
        "city": prospect["city"],
        "industry": prospect["industry"],
    }
    
    req = urllib.request.Request(
        API_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "User-Agent": "GetInTheAnswer-Outreach/1.0"},
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req, timeout=45) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            site_id = res_data.get("site_id")
            report_url = f"{DASHBOARD_BASE}?site_id={site_id}"
            return site_id, report_url
    except Exception as e:
        print(f"[!] Error scanning {prospect['companyName']}: {e}")
        return None, None

def generate_cold_email(prospect, report_url):
    owner = prospect.get("ownerName", "there")
    company = prospect["companyName"]
    city = prospect["city"]
    industry = prospect["industry"].lower()

    subject = f"Quick question regarding {company} on ChatGPT / Perplexity"
    body = f"""Hi {owner},

I was running some local AI search tests for {industry} services in {city} and noticed something interesting:

When potential customers ask ChatGPT or Perplexity for the top-rated {industry} in {city}, your competitors are consistently named first, while {company} is currently missing from the AI's top recommendations.

We ran a full 10-query visibility audit across ChatGPT, Claude & Perplexity for your website ({prospect['websiteUrl']}).

Here is your private report breakdown:
👉 {report_url}

It shows the exact queries tested, which competitors the AI is recommending instead of you, and 3 actionable fixes to get cited.

Would you be open to a quick 5-min chat this week on how to claim that top AI recommendation spot?

Best regards,

Gregory Baranes
Founder, GetInTheAnswer
www.getintheanswer.com
"""
    return subject, body

def main():
    print("=" * 60)
    print("🚀 GetInTheAnswer — US Outbound Sales Pipeline")
    print("=" * 60)
    
    for prospect in PROSPECTS:
        print(f"\n[*] Scanning {prospect['companyName']} ({prospect['city']})...")
        site_id, report_url = run_scan(prospect)
        
        if report_url:
            print(f"[+] Audit Created: {report_url}")
            subject, email_body = generate_cold_email(prospect, report_url)
            print("-" * 50)
            print(f"TO: {prospect['email']}")
            print(f"SUBJECT: {subject}")
            print(f"\n{email_body}")
            print("-" * 50)

if __name__ == "__main__":
    main()

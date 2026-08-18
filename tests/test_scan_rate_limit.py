import sys
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException, Request

API_DIR = Path(__file__).resolve().parents[1] / "apps" / "api"
sys.path.insert(0, str(API_DIR))

import main


def make_request(client_ip: str) -> Request:
    return Request(
        {
            "type": "http",
            "method": "POST",
            "path": "/api/onboarding",
            "headers": [(b"x-client-ip", client_ip.encode())],
            "client": ("10.0.0.10", 1234),
        }
    )


def make_payload(email: str = "owner@example.com") -> main.OnboardingRequest:
    return main.OnboardingRequest(
        companyName="Example Business",
        websiteUrl="https://example.com",
        email=email,
        city="Paris",
        industry="Consulting",
        services="Strategy",
    )


class ScanRateLimitTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        main.SCAN_ATTEMPTS.clear()

    def tearDown(self):
        main.SCAN_ATTEMPTS.clear()

    async def test_limits_repeated_scans_by_client_ip(self):
        request = make_request("198.51.100.8")

        with patch.object(main, "SCAN_RATE_LIMIT", 2):
            await main.enforce_scan_rate_limit(request, make_payload("first@example.com"))
            await main.enforce_scan_rate_limit(request, make_payload("second@example.com"))
            with self.assertRaises(HTTPException) as raised:
                await main.enforce_scan_rate_limit(request, make_payload("third@example.com"))

        self.assertEqual(raised.exception.status_code, 429)
        self.assertIn("Retry-After", raised.exception.headers)

    async def test_limits_repeated_scans_by_email_across_ips(self):
        payload = make_payload()

        with patch.object(main, "SCAN_RATE_LIMIT", 2):
            await main.enforce_scan_rate_limit(make_request("198.51.100.1"), payload)
            await main.enforce_scan_rate_limit(make_request("198.51.100.2"), payload)
            with self.assertRaises(HTTPException) as raised:
                await main.enforce_scan_rate_limit(make_request("198.51.100.3"), payload)

        self.assertEqual(raised.exception.status_code, 429)


if __name__ == "__main__":
    unittest.main()

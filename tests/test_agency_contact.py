import sys
import unittest
from pathlib import Path
from unittest.mock import AsyncMock, patch

from fastapi import HTTPException, Request

API_DIR = Path(__file__).resolve().parents[1] / "apps" / "api"
sys.path.insert(0, str(API_DIR))

import email_service  # noqa: E402
import main  # noqa: E402


def make_request(client_ip: str = "198.51.100.24") -> Request:
    return Request(
        {
            "type": "http",
            "method": "POST",
            "path": "/api/contact",
            "headers": [(b"x-client-ip", client_ip.encode())],
            "client": ("10.0.0.10", 1234),
        }
    )


def make_payload(**overrides) -> main.AgencyInquiryRequest:
    values = {
        "fullName": "Jordan Lee",
        "workEmail": "jordan@example.com",
        "companyName": "Northstar Agency",
        "websiteUrl": "https://example.com",
        "locationCount": 25,
        "message": "We manage a growing portfolio.",
        "companyWebsite": "",
    }
    values.update(overrides)
    return main.AgencyInquiryRequest(**values)


class AgencyContactTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        main.CONTACT_ATTEMPTS.clear()

    def tearDown(self):
        main.CONTACT_ATTEMPTS.clear()

    async def test_valid_inquiry_is_sent_with_prospect_as_reply_to(self):
        send_email = AsyncMock(return_value=True)

        with (
            patch.object(main, "NOTIFY_ADDRESS", "sales@getintheanswer.com"),
            patch.object(main, "send_email", send_email),
        ):
            result = await main.submit_agency_inquiry(make_payload(), make_request())

        self.assertEqual(result, {"status": "received"})
        self.assertEqual(send_email.await_count, 1)
        self.assertEqual(send_email.await_args.args[0], "sales@getintheanswer.com")
        self.assertEqual(send_email.await_args.kwargs["reply_to"], "jordan@example.com")

    async def test_honeypot_is_silently_accepted_without_sending(self):
        send_email = AsyncMock(return_value=True)

        with patch.object(main, "send_email", send_email):
            result = await main.submit_agency_inquiry(
                make_payload(companyWebsite="filled-by-bot.example"),
                make_request(),
            )

        self.assertEqual(result, {"status": "received"})
        send_email.assert_not_awaited()

    async def test_delivery_failure_returns_gateway_error(self):
        with (
            patch.object(main, "NOTIFY_ADDRESS", "sales@getintheanswer.com"),
            patch.object(main, "send_email", AsyncMock(return_value=False)),
            self.assertRaises(HTTPException) as raised,
        ):
            await main.submit_agency_inquiry(make_payload(), make_request())

        self.assertEqual(raised.exception.status_code, 502)

    async def test_repeated_inquiries_are_rate_limited_by_ip(self):
        request = make_request()

        with patch.object(main, "CONTACT_RATE_LIMIT", 2):
            await main.enforce_contact_rate_limit(request, make_payload(workEmail="first@example.com"))
            await main.enforce_contact_rate_limit(request, make_payload(workEmail="second@example.com"))
            with self.assertRaises(HTTPException) as raised:
                await main.enforce_contact_rate_limit(request, make_payload(workEmail="third@example.com"))

        self.assertEqual(raised.exception.status_code, 429)
        self.assertIn("Retry-After", raised.exception.headers)

    def test_notification_template_escapes_user_content_and_subject_newlines(self):
        subject, html = email_service.agency_inquiry_email(
            "<script>alert('name')</script>",
            "jordan@example.com",
            "Northstar\nBcc: victim@example.com",
            "https://example.com/?a=1&b=2",
            25,
            "<img src=x onerror=alert(1)>",
        )

        self.assertNotIn("\n", subject)
        self.assertNotIn("<script>", html)
        self.assertNotIn("<img src=x", html)
        self.assertIn("&lt;script&gt;", html)
        self.assertIn("&lt;img src=x onerror=alert(1)&gt;", html)


if __name__ == "__main__":
    unittest.main()

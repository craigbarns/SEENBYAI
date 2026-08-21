import sys
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

from fastapi import HTTPException

API_DIR = Path(__file__).resolve().parents[1] / "apps" / "api"
sys.path.insert(0, str(API_DIR))

import main  # noqa: E402


class CheckoutConfigurationTests(unittest.TestCase):
    def setUp(self):
        self.site_id = "1a2c00a4-27d4-4f65-a766-4407fcb4c3fa"
        self.body = main.CheckoutRequest(site_id=self.site_id, ga_client_id="123.456")

    def test_checkout_is_configured_for_us_buyers(self):
        checkout_session = SimpleNamespace(url="https://checkout.stripe.com/c/pay/test")

        with (
            patch.object(main, "BILLING_ENABLED", True),
            patch.object(main, "STRIPE_PRICE_ID", "price_usd_monthly"),
            patch.object(main, "STRIPE_CHECKOUT_LOCALE", "en"),
            patch.object(main, "load_report", return_value=SimpleNamespace()),
            patch.object(main, "get_report_email", return_value="owner@example.com"),
            patch.object(
                main.stripe.checkout.Session,
                "create",
                return_value=checkout_session,
            ) as create_checkout,
        ):
            result = main.create_checkout(self.body)

        self.assertEqual(result["url"], checkout_session.url)
        checkout = create_checkout.call_args.kwargs
        self.assertEqual(checkout["mode"], "subscription")
        self.assertEqual(checkout["line_items"], [{"price": "price_usd_monthly", "quantity": 1}])
        self.assertEqual(checkout["client_reference_id"], self.site_id)
        self.assertEqual(checkout["locale"], "en")
        self.assertEqual(checkout["automatic_tax"], {"enabled": True})
        self.assertEqual(checkout["billing_address_collection"], "required")
        self.assertEqual(checkout["branding_settings"]["display_name"], "GetInTheAnswer")
        self.assertEqual(checkout["branding_settings"]["button_color"], "#173b35")
        self.assertEqual(checkout["metadata"], {"site_id": self.site_id, "ga_client_id": "123.456"})
        self.assertEqual(checkout["subscription_data"], {"metadata": {"site_id": self.site_id}})

    def test_stripe_failure_returns_a_stable_gateway_error(self):
        with (
            patch.object(main, "BILLING_ENABLED", True),
            patch.object(main, "load_report", return_value=SimpleNamespace()),
            patch.object(main, "get_report_email", return_value="owner@example.com"),
            patch.object(
                main.stripe.checkout.Session,
                "create",
                side_effect=main.stripe.error.APIConnectionError("network unavailable"),
            ),
            self.assertRaises(HTTPException) as raised,
        ):
            main.create_checkout(self.body)

        self.assertEqual(raised.exception.status_code, 502)
        self.assertEqual(raised.exception.detail, "Checkout is temporarily unavailable")


if __name__ == "__main__":
    unittest.main()

import sys
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import Mock, patch

from fastapi import HTTPException

API_DIR = Path(__file__).resolve().parents[1] / "apps" / "api"
sys.path.insert(0, str(API_DIR))

import main  # noqa: E402


class BillingPortalAccessTests(unittest.TestCase):
    def setUp(self):
        self.body = main.PortalRequest(
            site_id="1a2c00a4-27d4-4f65-a766-4407fcb4c3fa",
            checkout_session_id="cs_test_authorized",
        )

    def test_rejects_a_checkout_session_for_another_report(self):
        checkout_session = SimpleNamespace(
            metadata=SimpleNamespace(site_id="aa48e3ac-cc8a-4b62-a48e-66f29735254a"),
            customer="cus_owner",
            payment_status="paid",
        )
        create_portal = Mock()

        with (
            patch.object(main, "BILLING_ENABLED", True),
            patch.object(main, "get_billing_customer", return_value="cus_owner"),
            patch.object(main.stripe.checkout.Session, "retrieve", return_value=checkout_session),
            patch.object(main.stripe.billing_portal.Session, "create", create_portal),
            self.assertRaises(HTTPException) as raised,
        ):
            main.create_billing_portal(self.body)

        self.assertEqual(raised.exception.status_code, 403)
        create_portal.assert_not_called()

    def test_opens_portal_for_the_verified_customer_and_report(self):
        checkout_session = SimpleNamespace(
            metadata=SimpleNamespace(site_id=self.body.site_id),
            customer="cus_owner",
            payment_status="paid",
        )
        portal_session = SimpleNamespace(url="https://billing.stripe.com/session/test")

        with (
            patch.object(main, "BILLING_ENABLED", True),
            patch.object(main, "get_billing_customer", return_value="cus_owner"),
            patch.object(main.stripe.checkout.Session, "retrieve", return_value=checkout_session),
            patch.object(
                main.stripe.billing_portal.Session,
                "create",
                return_value=portal_session,
            ) as create_portal,
        ):
            result = main.create_billing_portal(self.body)

        self.assertEqual(result["url"], portal_session.url)
        create_portal.assert_called_once_with(
            customer="cus_owner",
            return_url=f"{main.FRONTEND_URL}/dashboard?site_id={self.body.site_id}",
        )


if __name__ == "__main__":
    unittest.main()

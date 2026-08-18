import socket
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

API_DIR = Path(__file__).resolve().parents[1] / "apps" / "api"
sys.path.insert(0, str(API_DIR))

from site_audit import (  # noqa: E402
    UnsafeWebsiteUrl,
    validate_public_http_url,
    validate_url_structure,
)


class WebsiteUrlStructureTests(unittest.TestCase):
    def test_accepts_standard_https_url(self):
        self.assertEqual(validate_url_structure("https://example.com/path"), ("example.com", 443))

    def test_rejects_credentials(self):
        with self.assertRaises(UnsafeWebsiteUrl):
            validate_url_structure("https://admin:secret@example.com")

    def test_rejects_nonstandard_port(self):
        with self.assertRaises(UnsafeWebsiteUrl):
            validate_url_structure("https://example.com:8080")

    def test_rejects_local_hostname(self):
        with self.assertRaises(UnsafeWebsiteUrl):
            validate_url_structure("http://service.internal")


class WebsiteDnsSafetyTests(unittest.IsolatedAsyncioTestCase):
    async def test_rejects_private_ip_literal(self):
        with self.assertRaises(UnsafeWebsiteUrl):
            await validate_public_http_url("http://127.0.0.1")

    async def test_rejects_hostname_resolving_to_private_ip(self):
        result = [(socket.AF_INET, socket.SOCK_STREAM, 6, "", ("10.10.0.4", 443))]
        with (
            patch("site_audit.socket.getaddrinfo", return_value=result),
            self.assertRaises(UnsafeWebsiteUrl),
        ):
            await validate_public_http_url("https://example.com")

    async def test_accepts_hostname_resolving_only_to_public_ips(self):
        result = [(socket.AF_INET, socket.SOCK_STREAM, 6, "", ("8.8.8.8", 443))]
        with patch("site_audit.socket.getaddrinfo", return_value=result):
            await validate_public_http_url("https://example.com")

    async def test_rejects_mixed_public_and_private_dns_answers(self):
        result = [
            (socket.AF_INET, socket.SOCK_STREAM, 6, "", ("8.8.8.8", 443)),
            (socket.AF_INET, socket.SOCK_STREAM, 6, "", ("192.168.1.10", 443)),
        ]
        with (
            patch("site_audit.socket.getaddrinfo", return_value=result),
            self.assertRaises(UnsafeWebsiteUrl),
        ):
            await validate_public_http_url("https://example.com")


if __name__ == "__main__":
    unittest.main()

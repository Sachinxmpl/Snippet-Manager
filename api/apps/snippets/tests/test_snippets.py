from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.models import User
from apps.snippets.models import Snippet


def get_token(user):
    return str(RefreshToken.for_user(user).access_token)


class SnippetCRUDTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="alice", email="alice@example.com", password="pass"
        )
        self.other = User.objects.create_user(
            username="bob", email="bob@example.com", password="pass"
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {get_token(self.user)}")
        self.list_url = reverse("snippet-list")

    def _make_snippet(self, user=None, **kwargs):
        defaults = dict(
            title="Hello", code="print('hi')", language="python",
            user=user or self.user
        )
        defaults.update(kwargs)
        return Snippet.objects.create(**defaults)

    def test_create_snippet(self):
        data = {"title": "My snippet", "code": "x = 1", "language": "python"}
        resp = self.client.post(self.list_url, data)
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data["title"], "My snippet")

    def test_list_returns_only_own_snippets(self):
        self._make_snippet()
        self._make_snippet(user=self.other)
        resp = self.client.get(self.list_url)
        self.assertEqual(resp.data["count"], 1)

    def test_cannot_retrieve_other_users_snippet(self):
        s = self._make_snippet(user=self.other)
        resp = self.client.get(reverse("snippet-detail", args=[s.pk]))
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_partial_update(self):
        s = self._make_snippet()
        resp = self.client.patch(reverse("snippet-detail", args=[s.pk]), {"title": "Updated"})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        s.refresh_from_db()
        self.assertEqual(s.title, "Updated")

    def test_delete(self):
        s = self._make_snippet()
        resp = self.client.delete(reverse("snippet-detail", args=[s.pk]))
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)

    def test_search_by_title(self):
        self._make_snippet(title="Django tutorial")
        self._make_snippet(title="React basics")
        resp = self.client.get(self.list_url, {"search": "django"})
        self.assertEqual(resp.data["count"], 1)

    def test_filter_by_language(self):
        self._make_snippet(language="python")
        self._make_snippet(language="javascript")
        resp = self.client.get(self.list_url, {"language": "python"})
        self.assertEqual(resp.data["count"], 1)

    def test_unauthenticated_access_denied(self):
        self.client.credentials()
        resp = self.client.get(self.list_url)
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)


class PublicSnippetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="alice", email="alice@example.com", password="pass"
        )
        Snippet.objects.create(
            user=self.user, title="Public", code="x=1",
            language="python", is_public=True
        )
        Snippet.objects.create(
            user=self.user, title="Private", code="y=2",
            language="python", is_public=False
        )

    def test_public_feed_shows_only_public(self):
        resp = self.client.get(reverse("snippet-public"))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["count"], 1)

    def test_public_feed_requires_no_auth(self):
        resp = self.client.get(reverse("snippet-public"))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
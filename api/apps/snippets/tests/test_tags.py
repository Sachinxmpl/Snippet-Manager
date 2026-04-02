from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.models import User
from apps.snippets.models import Tag


def get_token(user):
    return str(RefreshToken.for_user(user).access_token)


class TagTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="alice", email="alice@example.com", password="pass"
        )
        self.other = User.objects.create_user(
            username="bob", email="bob@example.com", password="pass"
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {get_token(self.user)}")
        self.list_url = reverse("tag-list")

    def test_create_tag(self):
        resp = self.client.post(self.list_url, {"name": "Django"})
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data["name"], "django")  # lowercased

    def test_list_own_tags_only(self):
        Tag.objects.create(user=self.user, name="python")
        Tag.objects.create(user=self.other, name="java")
        resp = self.client.get(self.list_url)
        self.assertEqual(len(resp.data), 1)

    def test_duplicate_tag_rejected(self):
        Tag.objects.create(user=self.user, name="python")
        resp = self.client.post(self.list_url, {"name": "python"})
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_tag(self):
        tag = Tag.objects.create(user=self.user, name="python")
        resp = self.client.delete(reverse("tag-detail", args=[tag.pk]))
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)

    def test_cannot_delete_other_users_tag(self):
        tag = Tag.objects.create(user=self.other, name="java")
        resp = self.client.delete(reverse("tag-detail", args=[tag.pk]))
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)
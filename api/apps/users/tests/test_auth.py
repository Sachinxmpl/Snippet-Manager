from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.users.models import User


class RegistrationTests(APITestCase):
    url = reverse("auth-register")

    def test_register_success(self):
        data = {
            "username": "alice",
            "email": "alice@example.com",
            "password": "StrongPass123!",
            "password2": "StrongPass123!",
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email="alice@example.com").exists())

    def test_register_password_mismatch(self):
        data = {
            "username": "bob",
            "email": "bob@example.com",
            "password": "StrongPass123!",
            "password2": "WrongPass123!",
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_duplicate_email(self):
        User.objects.create_user(
            username="alice", email="alice@example.com", password="StrongPass123!"
        )
        data = {
            "username": "alice2",
            "email": "alice@example.com",
            "password": "StrongPass123!",
            "password2": "StrongPass123!",
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="alice", email="alice@example.com", password="StrongPass123!"
        )

    def test_login_success(self):
        response = self.client.post(
            reverse("auth-login"),
            {"email": "alice@example.com", "password": "StrongPass123!"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_login_wrong_password(self):
        response = self.client.post(
            reverse("auth-login"),
            {"email": "alice@example.com", "password": "wrong"},
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
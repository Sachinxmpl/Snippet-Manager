from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    Custom user model. Email is used as the login identifier.
    """
    email = models.EmailField(unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        ordering = ["-date_joined"]

    def __str__(self):
        return self.email
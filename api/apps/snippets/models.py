from django.conf import settings
from django.db import models


class Tag(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tags",
    )
    name = models.CharField(max_length=50)

    class Meta:
        ordering = ["name"]
        constraints = [
            models.UniqueConstraint(fields=["user", "name"], name="unique_tag_per_user")
        ]

    def __str__(self):
        return self.name


class Snippet(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="snippets",
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    code = models.TextField()
    language = models.CharField(max_length=50)
    tags = models.ManyToManyField(Tag, blank=True, related_name="snippets")
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return f"{self.title} ({self.language})"
from django.contrib import admin
from .models import Snippet, Tag


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name", "user")
    search_fields = ("name", "user__email")


@admin.register(Snippet)
class SnippetAdmin(admin.ModelAdmin):
    list_display = ("title", "language", "user", "is_public", "updated_at")
    search_fields = ("title", "description", "user__email")
    list_filter = ("language", "is_public")
    filter_horizontal = ("tags",)
    readonly_fields = ("created_at", "updated_at")
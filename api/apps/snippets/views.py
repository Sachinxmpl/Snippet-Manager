from rest_framework import generics, permissions
from rest_framework import filters as drf_filters
from django_filters.rest_framework import DjangoFilterBackend

from .filters import SnippetFilter
from .models import Snippet, Tag
from .serializers import PublicSnippetSerializer, SnippetSerializer, TagSerializer


class TagListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/v1/snippets/tags/
    POST /api/v1/snippets/tags/
    """
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None  # always return all tags

    def get_queryset(self):
        return Tag.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TagDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET / PATCH / DELETE /api/v1/snippets/tags/<pk>/
    """
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "patch", "delete", "head", "options"]

    def get_queryset(self):
        return Tag.objects.filter(user=self.request.user)


class SnippetListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/v1/snippets/
    POST /api/v1/snippets/
    Supports: ?search=  ?language=  ?is_public=  ?tags=  ?ordering=
    """
    serializer_class = SnippetSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, drf_filters.SearchFilter, drf_filters.OrderingFilter]
    filterset_class = SnippetFilter
    search_fields = ["title", "description", "code"]
    ordering_fields = ["title", "language", "created_at", "updated_at"]
    ordering = ["-updated_at"]

    def get_queryset(self):
        return (
            Snippet.objects.filter(user=self.request.user)
            .prefetch_related("tags")
            .select_related("user")
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SnippetDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET / PATCH / DELETE /api/v1/snippets/<pk>/
    """
    serializer_class = SnippetSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "patch", "delete", "head", "options"]

    def get_queryset(self):
        return (
            Snippet.objects.filter(user=self.request.user)
            .prefetch_related("tags")
            .select_related("user")
        )


class PublicSnippetListView(generics.ListAPIView):
    """
    GET /api/v1/snippets/public/  — no auth required
    """
    serializer_class = PublicSnippetSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [drf_filters.SearchFilter, drf_filters.OrderingFilter]
    search_fields = ["title", "description"]
    ordering_fields = ["created_at", "language"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return (
            Snippet.objects.filter(is_public=True)
            .prefetch_related("tags")
            .select_related("user")
        )
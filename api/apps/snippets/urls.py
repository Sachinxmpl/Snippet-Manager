from django.urls import path
from .views import (
    PublicSnippetListView,
    SnippetDetailView,
    SnippetListCreateView,
    TagDetailView,
    TagListCreateView,
)

urlpatterns = [
    path("tags/", TagListCreateView.as_view(), name="tag-list"),
    path("tags/<int:pk>/", TagDetailView.as_view(), name="tag-detail"),
    path("", SnippetListCreateView.as_view(), name="snippet-list"),
    path("<int:pk>/", SnippetDetailView.as_view(), name="snippet-detail"),
    path("public/", PublicSnippetListView.as_view(), name="snippet-public"),
]
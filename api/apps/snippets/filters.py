import django_filters
from .models import Snippet


class SnippetFilter(django_filters.FilterSet):
    language = django_filters.CharFilter(lookup_expr="iexact")
    is_public = django_filters.BooleanFilter()
    tags = django_filters.ModelMultipleChoiceFilter(
        field_name="tags",
        queryset=None,
    )

    class Meta:
        model = Snippet
        fields = ["language", "is_public", "tags"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.request
        if request and request.user.is_authenticated:
            from apps.snippets.models import Tag
            self.filters["tags"].queryset = Tag.objects.filter(user=request.user)
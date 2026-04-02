from rest_framework import serializers
from .models import Snippet, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name")
        read_only_fields = ("id",)

    def validate_name(self, value):
        return value.lower().strip()

    def validate(self, attrs):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            name = attrs.get("name", "").lower().strip()
            qs = Tag.objects.filter(user=request.user, name=name)
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError(
                    {"name": "You already have a tag with this name."}
                )
        return attrs


class SnippetSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        write_only=True,
        queryset=Tag.objects.none(),
        source="tags",
        required=False,
    )
    owner = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = Snippet
        fields = (
            "id", "owner", "title", "description", "code",
            "language", "tags", "tag_ids", "is_public",
            "created_at", "updated_at",
        )
        read_only_fields = ("id", "owner", "created_at", "updated_at")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            self.fields["tag_ids"].child_relation.queryset = Tag.objects.filter(
                user=request.user
            )

    def create(self, validated_data):
        tags = validated_data.pop("tags", [])
        snippet = Snippet.objects.create(**validated_data)
        snippet.tags.set(tags)
        return snippet

    def update(self, instance, validated_data):
        tags = validated_data.pop("tags", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tags is not None:
            instance.tags.set(tags)
        return instance


class PublicSnippetSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Snippet
        fields = (
            "id", "title", "description", "code",
            "language", "tags", "created_at", "updated_at",
        )
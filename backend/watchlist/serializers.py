from rest_framework import serializers

from .models import Media


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = [
            "id",
            "title",
            "type",
            "status",
            "rating",
            "poster_url",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Media
from .serializers import MediaSerializer


class MediaViewSet(viewsets.ModelViewSet):
    """CRUD for the logged-in user's own watchlist entries."""

    serializer_class = MediaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Media.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

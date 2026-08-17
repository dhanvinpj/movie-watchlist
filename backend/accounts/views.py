from rest_framework import generics, permissions
from django.contrib.auth.models import User

from .serializers import RegisterSerializer


class RegisterView(generics.CreateAPIView):
    """POST /api/accounts/register/  -> create a new user account."""

    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

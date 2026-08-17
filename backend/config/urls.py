from django.contrib import admin
from django.urls import include, path

try:
    from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
    jwt_available = True
except ImportError:
    jwt_available = False

urlpatterns = [
    path("admin/", admin.site.urls),

    # App routes
    path("api/accounts/", include("accounts.urls")),
    path("api/watchlist/", include("watchlist.urls")),
]

# JWT authentication (login / refresh)
if jwt_available:
    urlpatterns += [
        path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
        path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    ]

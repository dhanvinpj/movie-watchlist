from django.contrib import admin

from .models import Media


@admin.register(Media)
class MediaAdmin(admin.ModelAdmin):
    list_display = ("title", "owner", "type", "status", "rating", "created_at")
    list_filter = ("type", "status")
    search_fields = ("title", "owner__username")

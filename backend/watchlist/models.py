from django.contrib.auth.models import User
from django.db import models


class Media(models.Model):
    """A single movie / anime / TV show entry on a user's watchlist."""

    TYPE_CHOICES = [
        ("movie", "Movie"),
        ("anime", "Anime"),
        ("tv", "TV Show"),
    ]

    STATUS_CHOICES = [
        ("unwatched", "Unwatched"),
        ("watching", "Watching"),
        ("watched", "Watched"),
    ]

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="watchlist",
    )

    title = models.CharField(max_length=200)

    type = models.CharField(max_length=20, choices=TYPE_CHOICES)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="unwatched",
    )

    rating = models.PositiveIntegerField(null=True, blank=True)

    # Cover art fetched automatically from a public catalogue (iTunes Search
    # for movies/TV, Jikan/MyAnimeList for anime) when the item is added.
    # Left blank if no match was found - the frontend then shows a
    # placeholder icon instead of a broken image.
    poster_url = models.URLField(max_length=500, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title

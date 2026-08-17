# 🎬 Movie & Anime Watchlist

A full-stack watchlist app for tracking movies, anime, and TV shows you want
to watch (or have already watched). Built with a **Django REST Framework**
API and a **React (Vite)** frontend.

## Features

- Account registration and JWT-based login (with automatic token refresh)
- Add, edit, delete, and rate movies / anime / TV shows
- Search and filter your list by status or type
- **Automatic cover art** — when you add a title, the app looks up a matching
  poster/cover image for you automatically (no manual uploading, no API key
  required):
  - Movies & TV shows → [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/)
  - Anime → [Jikan API](https://jikan.moe/) (unofficial MyAnimeList API)
  - Each card also has a 🔄 button to re-run the lookup if the wrong image
    (or no image) was found
- Live stats: total items, watched, to-watch, average rating

## Project layout

```
movie-watchlist/
├── backend/                 Django REST API
│   ├── config/               project settings & root urls
│   ├── accounts/              registration / auth endpoints
│   ├── watchlist/              Media model, serializer, viewset
│   ├── manage.py
│   └── requirements.txt
└── frontend/                 React (Vite) app
    └── src/
        ├── pages/              LoginPage, RegisterPage, WatchlistPage
        ├── components/         Header, Statistics, AddMedia, SearchBar, WatchlistCard
        ├── context/             AuthContext (login state)
        ├── hooks/                useWatchlist (all watchlist state/logic)
        └── services/             api.js, authService.js, watchlistService.js, posterService.js
```

## Running it locally

### 1. Backend (Django API)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser   # optional, for /admin access
python manage.py runserver
```

The API runs at `http://127.0.0.1:8000`.

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:3000` and talks to the API above.

### 3. Use it

Open `http://localhost:3000`, click **Create one** to register a new
account, then log in and start adding movies/anime — cover art is fetched
automatically.

## Notes

- `SECRET_KEY` and CORS origins can be overridden with the `DJANGO_SECRET_KEY`,
  `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`, and `DJANGO_CORS_ALLOWED_ORIGINS`
  environment variables; sensible defaults are used if they're not set, so
  it also runs out of the box for local development/grading.
- The poster lookup runs in the browser and requires internet access. If a
  title can't be matched, the card just falls back to a type icon (🎬 / 🈴 / 📺).

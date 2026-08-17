const FILTERS = [
    { key: "all", label: "All" },
    { key: "watched", label: "✅ Watched" },
    { key: "watching", label: "▶️ Watching" },
    { key: "unwatched", label: "🍿 To Watch" },
    { key: "movie", label: "🎬 Movies" },
    { key: "anime", label: "🈴 Anime" },
    { key: "tv", label: "📺 TV Shows" },
];

function SearchBar({ search, setSearch, filter, setFilter }) {
    return (
        <div className="toolbar">
            <div className="search-box">
                <span>🔍</span>
                <input
                    type="text"
                    placeholder="Search your watchlist..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="filters">
                {FILTERS.map((f) => (
                    <button
                        key={f.key}
                        type="button"
                        className={filter === f.key ? "active" : ""}
                        onClick={() => setFilter(f.key)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default SearchBar;

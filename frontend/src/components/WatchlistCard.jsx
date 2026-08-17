const TYPE_ICON = { movie: "🎬", anime: "🈴", tv: "📺" };
const TYPE_LABEL = { movie: "Movie", anime: "Anime", tv: "TV Show" };
const STATUS_LABEL = {
    unwatched: "🍿 To Watch",
    watching: "▶️ Watching",
    watched: "✅ Watched",
};
const RATING_OPTIONS = [1, 2, 3, 4, 5];

function WatchlistCard({
    item,
    editingId,
    editingTitle, setEditingTitle,
    editingType, setEditingType,
    editingStatus, setEditingStatus,
    editingRating, setEditingRating,
    onStartEdit,
    onCancelEdit,
    onSaveEdit,
    onRatingChange,
    onStatusChange,
    onDelete,
    onRefreshPoster,
    refreshingPosterId,
}) {
    const isEditing = editingId === item.id;
    const isRefreshingPoster = refreshingPosterId === item.id;

    if (isEditing) {
        return (
            <div className="card">
                <div className="edit-box">
                    <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        placeholder="Title"
                    />

                    <select value={editingType} onChange={(e) => setEditingType(e.target.value)}>
                        <option value="movie">Movie</option>
                        <option value="anime">Anime</option>
                        <option value="tv">TV Show</option>
                    </select>

                    <select value={editingStatus} onChange={(e) => setEditingStatus(e.target.value)}>
                        <option value="unwatched">Unwatched</option>
                        <option value="watching">Watching</option>
                        <option value="watched">Watched</option>
                    </select>

                    <select
                        value={editingRating}
                        onChange={(e) => setEditingRating(Number(e.target.value))}
                    >
                        <option value={0}>No rating</option>
                        {RATING_OPTIONS.map((n) => (
                            <option key={n} value={n}>
                                {"⭐".repeat(n)}
                            </option>
                        ))}
                    </select>

                    <div className="edit-buttons">
                        <button onClick={() => onSaveEdit(item.id)}>💾 Save</button>
                        <button className="cancel" onClick={onCancelEdit}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="poster">
                {item.poster_url ? (
                    <img
                        src={item.poster_url}
                        alt={item.title}
                        className="poster-img"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <span className="poster-icon">{TYPE_ICON[item.type] || "🎞️"}</span>
                )}

                <span className="poster-type">{TYPE_LABEL[item.type] || item.type}</span>

                <button
                    type="button"
                    className="poster-refresh"
                    title="Look up cover art again"
                    onClick={() => onRefreshPoster(item)}
                    disabled={isRefreshingPoster}
                >
                    {isRefreshingPoster ? "…" : "🔄"}
                </button>
            </div>

            <div className="card-content">
                <h3>{item.title}</h3>
                <p className="status">{STATUS_LABEL[item.status] || item.status}</p>

                <div className="rating">
                    <span>Your rating</span>
                    <div className="stars">
                        {RATING_OPTIONS.map((n) => (
                            <button
                                key={n}
                                type="button"
                                className={`star ${n <= (item.rating || 0) ? "selected" : ""}`}
                                onClick={() => onRatingChange(item, n === item.rating ? 0 : n)}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="card-actions">
                <button className="watch" onClick={() => onStatusChange(item)}>
                    {item.status === "watched" ? "🍿 Mark unwatched" : "✅ Mark watched"}
                </button>
                <button className="edit" onClick={() => onStartEdit(item)}>
                    ✏️ Edit
                </button>
                <button className="delete" onClick={() => onDelete(item.id)}>
                    🗑️ Delete
                </button>
            </div>
        </div>
    );
}

export default WatchlistCard;

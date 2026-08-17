const RATING_OPTIONS = [1, 2, 3, 4, 5];

function AddMedia({
    title, setTitle,
    type, setType,
    status, setStatus,
    rating, setRating,
    onSubmit,
    error,
    isSubmitting,
}) {
    return (
        <section className="add-section">
            <h2>➕ Add a movie or anime</h2>

            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder="Title (e.g. Inception, Attack on Titan)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="movie">🎬 Movie</option>
                    <option value="anime">🈴 Anime</option>
                    <option value="tv">📺 TV Show</option>
                </select>

                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="unwatched">🍿 Unwatched</option>
                    <option value="watching">▶️ Watching</option>
                    <option value="watched">✅ Watched</option>
                </select>

                <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    <option value={0}>No rating</option>
                    {RATING_OPTIONS.map((n) => (
                        <option key={n} value={n}>
                            {"⭐".repeat(n)}
                        </option>
                    ))}
                </select>

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "+ Add"}
                </button>
            </form>

            <p className="hint">
                🔎 We'll automatically try to fetch cover art for whatever you add.
            </p>

            {error && <div className="error">{error}</div>}
        </section>
    );
}

export default AddMedia;

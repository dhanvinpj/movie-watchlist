import Header from "../components/Header";
import Statistics from "../components/Statistics";
import AddMedia from "../components/AddMedia";
import SearchBar from "../components/SearchBar";
import WatchlistCard from "../components/WatchlistCard";
import { useWatchlist } from "../hooks/useWatchlist";

function sectionTitle(filter) {
    if (filter === "watched") return "✅ Watched";
    if (filter === "unwatched") return "🍿 To Watch";
    if (filter === "watching") return "▶️ Watching";
    if (filter === "movie") return "🎬 Movies";
    if (filter === "anime") return "🈴 Anime";
    if (filter === "tv") return "📺 TV Shows";
    return "🎬 Your Watchlist";
}

function WatchlistPage() {
    const watchlist = useWatchlist();

    return (
        <div className="app">
            <Header />

            <main className="container">
                <Statistics {...watchlist.stats} />

                <AddMedia
                    title={watchlist.title}
                    setTitle={watchlist.setTitle}
                    type={watchlist.type}
                    setType={watchlist.setType}
                    status={watchlist.status}
                    setStatus={watchlist.setStatus}
                    rating={watchlist.rating}
                    setRating={watchlist.setRating}
                    onSubmit={watchlist.addMedia}
                    error={watchlist.error}
                    isSubmitting={watchlist.isSubmitting}
                />

                <SearchBar
                    search={watchlist.search}
                    setSearch={watchlist.setSearch}
                    filter={watchlist.filter}
                    setFilter={watchlist.setFilter}
                />

                <section>
                    <div className="section-heading">
                        <h2>{sectionTitle(watchlist.filter)}</h2>
                        <span>{watchlist.media.length} items</span>
                    </div>

                    {watchlist.loading ? (
                        <div className="empty">Loading watchlist...</div>
                    ) : watchlist.media.length === 0 ? (
                        <div className="empty">
                            <div>🍿</div>
                            <h3>No items found</h3>
                            <p>Add a movie or anime to your watchlist.</p>
                        </div>
                    ) : (
                        <div className="grid">
                            {watchlist.media.map((item) => (
                                <WatchlistCard
                                    key={item.id}
                                    item={item}
                                    editingId={watchlist.editingId}
                                    editingTitle={watchlist.editingTitle}
                                    setEditingTitle={watchlist.setEditingTitle}
                                    editingType={watchlist.editingType}
                                    setEditingType={watchlist.setEditingType}
                                    editingStatus={watchlist.editingStatus}
                                    setEditingStatus={watchlist.setEditingStatus}
                                    editingRating={watchlist.editingRating}
                                    setEditingRating={watchlist.setEditingRating}
                                    onStartEdit={watchlist.startEditing}
                                    onCancelEdit={watchlist.cancelEditing}
                                    onSaveEdit={watchlist.saveEdit}
                                    onRatingChange={watchlist.updateRating}
                                    onStatusChange={watchlist.changeStatus}
                                    onDelete={watchlist.removeMedia}
                                    onRefreshPoster={watchlist.refreshPoster}
                                    refreshingPosterId={watchlist.refreshingPosterId}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <footer>🎬 My Movie &amp; Anime Watchlist</footer>
        </div>
    );
}

export default WatchlistPage;

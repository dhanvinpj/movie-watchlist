function Statistics({ total, watched, unwatched, averageRating }) {
    return (
        <div className="stats">
            <div className="stat-card">
                <span>🎬</span>
                <div>
                    <strong>{total}</strong>
                    <small>Total items</small>
                </div>
            </div>

            <div className="stat-card green">
                <span>✅</span>
                <div>
                    <strong>{watched}</strong>
                    <small>Watched</small>
                </div>
            </div>

            <div className="stat-card orange">
                <span>🍿</span>
                <div>
                    <strong>{unwatched}</strong>
                    <small>To watch</small>
                </div>
            </div>

            <div className="stat-card purple">
                <span>⭐</span>
                <div>
                    <strong>{averageRating}</strong>
                    <small>Avg. rating</small>
                </div>
            </div>
        </div>
    );
}

export default Statistics;

import { useAuth } from "../context/AuthContext";

function Header() {
    const { logout } = useAuth();

    return (
        <header className="header">
            <div>
                <h1>🎬 My Watchlist</h1>
                <p>Movies &amp; Anime</p>
            </div>

            <button className="logout" onClick={logout}>
                🚪 Logout
            </button>
        </header>
    );
}

export default Header;

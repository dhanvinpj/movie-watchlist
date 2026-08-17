import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import * as authService from "../services/authService";

function LoginPage({ onSwitchToRegister }) {
    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const { access, refresh } = await authService.login(username, password);
            login(access, refresh);
        } catch (err) {
            console.error(err);
            setError(err.message || "Could not log in.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>🎬 Movie Watchlist</h1>
                <p>Log in to your account</p>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                />

                {error && <div className="error">{error}</div>}

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Login"}
                </button>

                <p className="auth-switch">
                    Don't have an account?{" "}
                    <button type="button" className="link-button" onClick={onSwitchToRegister}>
                        Create one
                    </button>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;

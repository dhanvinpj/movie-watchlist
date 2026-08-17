import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import * as authService from "../services/authService";

function RegisterPage({ onSwitchToLogin }) {
    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            await authService.register(username, email, password);
            // Registration succeeded - log the new user straight in so
            // they land directly on their (empty) watchlist.
            const { access, refresh } = await authService.login(username, password);
            login(access, refresh);
        } catch (err) {
            console.error(err);
            setError(err.message || "Could not create your account.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>🎬 Movie Watchlist</h1>
                <p>Create your account</p>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                />

                <input
                    type="email"
                    placeholder="Email (optional)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                />

                {error && <div className="error">{error}</div>}

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating account..." : "Sign up"}
                </button>

                <p className="auth-switch">
                    Already have an account?{" "}
                    <button type="button" className="link-button" onClick={onSwitchToLogin}>
                        Log in
                    </button>
                </p>
            </form>
        </div>
    );
}

export default RegisterPage;

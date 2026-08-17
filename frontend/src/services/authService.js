import { API_URL } from "./api";

/** Logs in and returns the {access, refresh} JWT pair. */
export async function login(username, password) {
    const response = await fetch(`${API_URL}/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Invalid username or password.");
    }

    return data;
}

/** Creates a new account. Does not log the user in automatically. */
export async function register(username, email, password) {
    const response = await fetch(`${API_URL}/api/accounts/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        const firstError = Object.values(data)[0];
        const message = Array.isArray(firstError) ? firstError[0] : firstError;
        throw new Error(message || "Could not create your account.");
    }

    return data;
}

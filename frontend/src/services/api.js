// Low-level fetch helper shared by every service.
// Handles attaching the JWT access token and transparently
// refreshing it once if it has expired.

export const API_URL = "http://127.0.0.1:8000";

async function refreshAccessToken() {
    const refresh = localStorage.getItem("refresh");

    if (!refresh) {
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/api/token/refresh/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh }),
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        localStorage.setItem("access", data.access);

        return data.access;
    } catch {
        return null;
    }
}

/**
 * Fetch wrapper that adds the Authorization header and retries once
 * with a refreshed access token if the first attempt returns 401.
 */
export async function apiRequest(path, options = {}, retry = true) {
    const url = path.startsWith("http")
        ? path
        : `${API_URL}${path}`;

    const token = localStorage.getItem("access");

    const headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    let response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401 && retry) {
        const newToken = await refreshAccessToken();

        if (!newToken) {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");

            throw new Error("SESSION_EXPIRED");
        }

        response = await fetch(url, {
            ...options,
            headers: {
                ...headers,
                Authorization: `Bearer ${newToken}`,
            },
        });
    }

    return response;
}

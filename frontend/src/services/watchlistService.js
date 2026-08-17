import { apiRequest } from "./api";

const BASE = "/api/watchlist/media/";

async function parseOrThrow(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message =
            data.detail ||
            (typeof data === "object" ? JSON.stringify(data) : "Something went wrong.");
        throw new Error(message);
    }

    return data;
}

export async function getMedia() {
    const response = await apiRequest(BASE);
    if (!response.ok) throw new Error("Failed to load your watchlist.");
    return response.json();
}

export async function createMedia(payload) {
    const response = await apiRequest(BASE, {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return parseOrThrow(response);
}

export async function updateMedia(id, payload) {
    const response = await apiRequest(`${BASE}${id}/`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
    return parseOrThrow(response);
}

export async function deleteMedia(id) {
    const response = await apiRequest(`${BASE}${id}/`, { method: "DELETE" });
    if (!response.ok) throw new Error("Could not delete that item.");
}

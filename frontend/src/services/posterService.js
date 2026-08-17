// Automatic cover-art lookup.
//
// Movies / TV -> iTunes Search API
// Anime       -> Jikan (MyAnimeList) API
//
// Returns a direct image URL or null if no poster is found.

const ITUNES_SEARCH_URL = "https://itunes.apple.com/search";
const JIKAN_SEARCH_URL = "https://api.jikan.moe/v4/anime";

const FETCH_TIMEOUT_MS = 6000;

function withTimeout() {
    return typeof AbortSignal !== "undefined" && AbortSignal.timeout
        ? AbortSignal.timeout(FETCH_TIMEOUT_MS)
        : undefined;
}

async function searchITunes(title, media) {
    const params = new URLSearchParams({
        term: title,
        media,
        limit: "5",
    });

    const response = await fetch(`${ITUNES_SEARCH_URL}?${params}`, {
        signal: withTimeout(),
    });

    if (!response.ok) {
        console.error("iTunes request failed:", response.status);
        return null;
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        return null;
    }

    // Try the first result that actually has artwork.
    const result = data.results.find(
        (item) => item.artworkUrl100 || item.artworkUrl60
    );

    if (!result) {
        return null;
    }

    const artwork = result.artworkUrl100 || result.artworkUrl60;

    // Convert 100x100 artwork into a larger image.
    return artwork.replace(/\d+x\d+bb/, "600x600bb");
}

async function searchJikan(title) {
    const params = new URLSearchParams({
        q: title,
        limit: "5",
    });

    const response = await fetch(`${JIKAN_SEARCH_URL}?${params}`, {
        signal: withTimeout(),
    });

    if (!response.ok) {
        console.error("Jikan request failed:", response.status);
        return null;
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
        return null;
    }

    // Find the first anime that actually has an image.
    for (const anime of data.data) {
        const image = anime?.images?.jpg;

        if (image?.large_image_url) {
            return image.large_image_url;
        }

        if (image?.image_url) {
            return image.image_url;
        }
    }

    return null;
}

export async function fetchPosterUrl(title, type) {
    const cleanTitle = (title || "").trim();

    if (!cleanTitle) {
        return null;
    }

    try {
        console.log(`Looking for poster: "${cleanTitle}" (${type})`);

        if (type === "anime") {
            const poster =
                (await searchJikan(cleanTitle)) ||
                (await searchITunes(cleanTitle, "tvShow"));

            console.log("Poster found:", poster);

            return poster;
        }

        if (type === "tv") {
            const poster =
                (await searchITunes(cleanTitle, "tvShow")) ||
                (await searchJikan(cleanTitle));

            console.log("Poster found:", poster);

            return poster;
        }

        const poster = await searchITunes(cleanTitle, "movie");

        console.log("Poster found:", poster);

        return poster;
    } catch (error) {
        console.error("Poster lookup failed:", error);
        return null;
    }
}

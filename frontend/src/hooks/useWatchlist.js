import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "../context/AuthContext";
import * as watchlistService from "../services/watchlistService";
import { fetchPosterUrl } from "../services/posterService";

/**
 * Encapsulates every piece of state and every server call the watchlist
 * page needs, so the page component itself only has to worry about
 * rendering. Also owns automatic cover-art lookup when an item is added
 * or manually refreshed.
 */
export function useWatchlist() {
    const { logout } = useAuth();

    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Add-media form state
    const [title, setTitle] = useState("");
    const [type, setType] = useState("movie");
    const [status, setStatus] = useState("unwatched");
    const [rating, setRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Search / filter
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    // Inline edit state
    const [editingId, setEditingId] = useState(null);
    const [editingTitle, setEditingTitle] = useState("");
    const [editingType, setEditingType] = useState("movie");
    const [editingStatus, setEditingStatus] = useState("unwatched");
    const [editingRating, setEditingRating] = useState(0);

    // Which card (if any) is currently re-fetching its poster
    const [refreshingPosterId, setRefreshingPosterId] = useState(null);

    const handleAuthError = useCallback(
        (err, fallbackMessage) => {
            if (err.message === "SESSION_EXPIRED") {
                logout();
                setError("Your session expired. Please log in again.");
            } else {
                setError(fallbackMessage);
            }
        },
        [logout]
    );

    const fetchMedia = useCallback(async () => {
        try {
            setLoading(true);
            const data = await watchlistService.getMedia();
            setMedia(data);
            setError("");
        } catch (err) {
            console.error(err);
            handleAuthError(err, "Could not load your watchlist.");
        } finally {
            setLoading(false);
        }
    }, [handleAuthError]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchMedia();
    }, [fetchMedia]);

    const addMedia = async (event) => {
        event.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);

        try {
            // Best-effort cover art lookup - a slow/failed lookup should
            // never stop the user from saving the item.
            const posterUrl = await fetchPosterUrl(title, type);

            const created = await watchlistService.createMedia({
                title: title.trim(),
                type,
                status,
                rating: Number(rating),
                poster_url: posterUrl,
            });

            setMedia((current) => [created, ...current]);

            setTitle("");
            setType("movie");
            setStatus("unwatched");
            setRating(0);
            setError("");
        } catch (err) {
            console.error(err);
            handleAuthError(err, err.message || "Could not add that item.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeMedia = async (id) => {
        const confirmed = window.confirm("Delete this movie/anime from your watchlist?");
        if (!confirmed) return;

        try {
            await watchlistService.deleteMedia(id);
            setMedia((current) => current.filter((item) => item.id !== id));
        } catch (err) {
            console.error(err);
            handleAuthError(err, "Could not delete that item.");
        }
    };

    const applyUpdate = (id, patch) =>
        setMedia((current) => current.map((item) => (item.id === id ? patch : item)));

    const changeStatus = async (item) => {
        const newStatus = item.status === "watched" ? "unwatched" : "watched";

        try {
            const updated = await watchlistService.updateMedia(item.id, { status: newStatus });
            applyUpdate(item.id, updated);
        } catch (err) {
            console.error(err);
            handleAuthError(err, "Could not update the status.");
        }
    };

    const updateRating = async (item, newRating) => {
        try {
            const updated = await watchlistService.updateMedia(item.id, { rating: newRating });
            applyUpdate(item.id, updated);
        } catch (err) {
            console.error(err);
            handleAuthError(err, "Could not update the rating.");
        }
    };

    const refreshPoster = async (item) => {
        setRefreshingPosterId(item.id);

        try {
            const posterUrl = await fetchPosterUrl(item.title, item.type);
            const updated = await watchlistService.updateMedia(item.id, { poster_url: posterUrl });
            applyUpdate(item.id, updated);

            if (!posterUrl) {
                setError(`Couldn't find cover art for "${item.title}".`);
            }
        } catch (err) {
            console.error(err);
            handleAuthError(err, "Could not refresh the cover art.");
        } finally {
            setRefreshingPosterId(null);
        }
    };

    const startEditing = (item) => {
        setEditingId(item.id);
        setEditingTitle(item.title);
        setEditingType(item.type);
        setEditingStatus(item.status);
        setEditingRating(item.rating || 0);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingTitle("");
        setEditingType("movie");
        setEditingStatus("unwatched");
        setEditingRating(0);
    };

    const saveEdit = async (id) => {
        if (!editingTitle.trim()) {
            setError("Title cannot be empty.");
            return;
        }

        try {
            const updated = await watchlistService.updateMedia(id, {
                title: editingTitle.trim(),
                type: editingType,
                status: editingStatus,
                rating: Number(editingRating),
            });

            applyUpdate(id, updated);
            cancelEditing();
            setError("");
        } catch (err) {
            console.error(err);
            handleAuthError(err, "Could not save your changes.");
        }
    };

    const filteredMedia = useMemo(() => {
        return media.filter((item) => {
            const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
            const matchesFilter =
                filter === "all" || item.status === filter || item.type === filter;
            return matchesSearch && matchesFilter;
        });
    }, [media, search, filter]);

    const stats = useMemo(() => {
        const total = media.length;
        const watched = media.filter((item) => item.status === "watched").length;
        const unwatched = media.filter((item) => item.status === "unwatched").length;
        const averageRating =
            total > 0
                ? (media.reduce((sum, item) => sum + Number(item.rating || 0), 0) / total).toFixed(1)
                : "0.0";

        return { total, watched, unwatched, averageRating };
    }, [media]);

    return {
        // data
        media: filteredMedia,
        loading,
        error,
        stats,

        // add form
        title, setTitle,
        type, setType,
        status, setStatus,
        rating, setRating,
        isSubmitting,
        addMedia,

        // search / filter
        search, setSearch,
        filter, setFilter,

        // editing
        editingId,
        editingTitle, setEditingTitle,
        editingType, setEditingType,
        editingStatus, setEditingStatus,
        editingRating, setEditingRating,
        startEditing,
        cancelEditing,
        saveEdit,

        // item actions
        changeStatus,
        updateRating,
        removeMedia,
        refreshPoster,
        refreshingPosterId,
    };
}

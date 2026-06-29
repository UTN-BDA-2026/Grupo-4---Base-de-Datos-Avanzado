import { useState, useCallback } from 'react';
import { getPlaylists, addSongToPlaylist as addSongToPlaylistService } from '../services/playlistService';
import { toggleSaveAlbum, getSavedAlbums, toggleFollowArtist, getFollowedArtists } from '../services/musicService';

export const useLibraryActions = () => {
    const [playlists, setPlaylists] = useState([]);
    const [savedAlbums, setSavedAlbums] = useState([]);
    const [followedArtists, setFollowedArtists] = useState([]);
    const [followOverrides, setFollowOverrides] = useState({});
    const [modal, setModal] = useState({ open: false, item: null });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchPlaylists = useCallback(async () => {
        try {
            const data = await getPlaylists();
            setPlaylists(data);
        } catch {
            showToast('Error al cargar playlists', 'error');
        }
    }, []);

    const fetchSavedAlbums = useCallback(async () => {
        try {
            const data = await getSavedAlbums();
            setSavedAlbums(Array.isArray(data) ? data : []);
        } catch {
            showToast('Error al cargar los álbumes de tu biblioteca', 'error');
        }
    }, []);

    const fetchFollowedArtists = useCallback(async () => {
        try {
            const data = await getFollowedArtists();
            setFollowedArtists(Array.isArray(data) ? data : []);
        } catch {
            showToast('Error al cargar tus artistas seguidos', 'error');
        }
    }, []);

    const openModal = useCallback((item) => {
        setModal({ open: true, item });
        fetchPlaylists();
    }, [fetchPlaylists]);

    const closeModal = useCallback(() => {
        setModal({ open: false, item: null });
    }, []);

    const addSongToPlaylist = useCallback(async (playlistId, songId) => {
        setLoading(true);
        try {
            await addSongToPlaylistService(playlistId, songId);
            showToast('Canción agregada correctamente');
            closeModal();
        } catch (err) {
            const msg = err.response?.data?.error || 'Error al agregar la canción';
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    }, [closeModal]);

    const handleToggleSaveAlbum = useCallback(async (deezerId) => {
        showToast('Actualizando biblioteca...');
        try {
            const data = await toggleSaveAlbum(deezerId);
            showToast(data.message, 'success');
            fetchSavedAlbums();
        } catch (err) {
            const msg = err.response?.data?.error || 'Error al actualizar el álbum en la biblioteca';
            showToast(msg, 'error');
        }
    }, [fetchSavedAlbums]);

    const handleToggleFollowArtist = useCallback(async (deezerId, currentlyFollowing) => {
        setFollowOverrides((prev) => ({ ...prev, [deezerId]: !currentlyFollowing }));

        if (currentlyFollowing) {
            setFollowedArtists((prev) => prev.filter((fa) => fa.artist.deezer_id !== deezerId));
        }

        try {
            const data = await toggleFollowArtist(deezerId);
            showToast(data.message, 'success');
            setFollowOverrides((prev) => ({ ...prev, [deezerId]: data.following }));

            if (data.following) {
                fetchFollowedArtists();
            }
        } catch (err) {
            setFollowOverrides((prev) => ({ ...prev, [deezerId]: currentlyFollowing }));
            if (currentlyFollowing) {
                fetchFollowedArtists();
            }
            const msg = err.response?.data?.error || 'Error al actualizar el seguimiento del artista';
            showToast(msg, 'error');
        }
    }, [fetchFollowedArtists]);

    return {
        playlists,
        savedAlbums,
        followedArtists,
        followOverrides,
        modal,
        loading,
        toast,
        openModal,
        closeModal,
        addSongToPlaylist,
        handleToggleSaveAlbum,
        handleToggleFollowArtist,
        fetchPlaylists,
        fetchSavedAlbums,
        fetchFollowedArtists,
    };
};
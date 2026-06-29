import { useState, useEffect, useCallback } from 'react';
import { 
    getPlaylistDetail, 
    updatePlaylist as updatePlaylistService,
    deletePlaylist as deletePlaylistService,
    removeSongFromPlaylist 
} from '../services/playlistService'; 

export const usePlaylist = (id) => {
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchPlaylist = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getPlaylistDetail(id);
            setPlaylist(data);
        } catch (err) {
            console.error('Error al traer la playlist:', err);
            setError('No se pudo cargar la playlist.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (!id) return;
        fetchPlaylist();
    }, [fetchPlaylist]);

    const updatePlaylist = async (newName) => {
        try {
            await updatePlaylistService(id, { name: newName });
            await fetchPlaylist();
            showToast('Playlist actualizada.');
            return true;
        } catch {
            showToast('Error al actualizar la playlist.', 'error');
            return false;
        }
    };

    const deletePlaylist = async () => {
        try {
            await deletePlaylistService(id);
            return true;
        } catch {
            showToast('Error al eliminar la playlist.', 'error');
            return false;
        }
    };

    const removeSong = async (songId) => {
        try {
            await removeSongFromPlaylist(id, songId);
            await fetchPlaylist(); 
            showToast('Canción eliminada de la playlist.');
        } catch (err) {
            console.error('Error al remover canción:', err);
            showToast('Error al eliminar la canción.', 'error');
        }
    };

    return { 
        playlist, 
        loading, 
        error, 
        toast, 
        updatePlaylist, 
        deletePlaylist, 
        removeSong 
    };
};
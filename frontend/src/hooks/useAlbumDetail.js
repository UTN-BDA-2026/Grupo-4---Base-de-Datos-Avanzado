import { useState, useEffect } from 'react';
import { getAlbumDetail, getAlbumSongs } from '../services/musicService';

export const useAlbumDetail = (deezerId) => {
  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!deezerId) return;

    const fetchAlbumDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const [albumData, songsData] = await Promise.all([
          getAlbumDetail(deezerId),
          getAlbumSongs(deezerId),
        ]);
        setAlbum(albumData);
        setSongs(songsData);
      } catch (err) {
        console.error('Error cargando detalle del álbum:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumDetail();
  }, [deezerId]);

  return { album, songs, loading, error };
};
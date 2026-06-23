import { useState, useEffect } from 'react';
import { getRecentlyPlayed, getTopArtists, getTopAlbums } from '../services/musicService';

export const useHomeData = () => {
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topAlbums, setTopAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [recent, artists, albums] = await Promise.all([
          getRecentlyPlayed(20),
          getTopArtists(20),
          getTopAlbums(20),
        ]);
        setRecentlyPlayed(recent);
        setTopArtists(artists);
        setTopAlbums(albums);
      } catch (err) {
        console.error('Error cargando datos del home:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return { recentlyPlayed, topArtists, topAlbums, loading, error };
};
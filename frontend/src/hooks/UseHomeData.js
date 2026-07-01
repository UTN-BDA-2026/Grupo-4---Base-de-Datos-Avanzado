import { useState, useEffect } from 'react';
import { getTopArtists, getTopAlbums, getTopSongs, getRecentlyPlayed } from '../services/musicService';

export const useHomeData = () => {
  const [topArtists, setTopArtists] = useState([]);
  const [topAlbums, setTopAlbums] = useState([]);
  const [topSongs, setTopSongs] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [artists, albums, songs, recent] = await Promise.all([
          getTopArtists(20),
          getTopAlbums(20),
          getTopSongs(20),
          getRecentlyPlayed(8),
        ]);
        setTopArtists(artists);
        setTopAlbums(albums);
        setTopSongs(songs);
        setRecentlyPlayed(recent);
      } catch (err) {
        console.error('Error cargando datos del home:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return { topArtists, topAlbums, topSongs, recentlyPlayed, loading, error };
};
import { useState, useEffect } from 'react';
import { searchAll } from '../services/musicService';

export const useSearch = (query, delay = 400) => {
  const [results, setResults] = useState({ songs: [], artists: [], albums: [], playlists: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setResults({ songs: [], artists: [], albums: [], playlists: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        setError(null);
        const data = await searchAll(trimmed);
        setResults({
          songs: data.songs || [],
          artists: data.artists || [],
          albums: data.albums || [],
          playlists: data.playlists || [],
        });
      } catch (err) {
        console.error('Error buscando:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  return { results, loading, error };
};
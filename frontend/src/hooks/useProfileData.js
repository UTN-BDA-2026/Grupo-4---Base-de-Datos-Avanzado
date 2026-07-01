import { useState, useEffect } from 'react';
import { getTopArtistsMonth, getTopSongsByUser, getRecentlyPlayed } from '../services/musicService';

export const useProfileData = () => {
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [artists, tracks, recent] = await Promise.all([
          getTopArtistsMonth(20),
          getTopSongsByUser(25),
          getRecentlyPlayed(20),
        ]);
        if (!active) return;
        setTopArtists(artists);
        setTopTracks(tracks);
        setRecentlyPlayed(recent);
      } catch (err) {
        if (active) setError(err);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => { active = false; };
  }, []);

  return { topArtists, topTracks, recentlyPlayed, loading, error };
};
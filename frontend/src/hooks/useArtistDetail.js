import { useState, useEffect, useCallback } from 'react';
import { getArtistDetail, getArtistSongs, getArtistAlbums, toggleFollowArtist } from '../services/musicService';

export const useArtistDetail = (deezerId) => {
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [albumsLoading, setAlbumsLoading] = useState(false);
  const [albumTab, setAlbumTab] = useState('popular');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (!deezerId) return;

    const fetchArtistDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const [artistData, songsData] = await Promise.all([
          getArtistDetail(deezerId),
          getArtistSongs(deezerId),
        ]);
        setArtist(artistData);
        setSongs(songsData);
      } catch (err) {
        console.error('Error cargando detalle del artista:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistDetail();
  }, [deezerId]);

  useEffect(() => {
    if (!deezerId) return;

    const fetchAlbumsForTab = async () => {
      try {
        setAlbumsLoading(true);
        setAlbums([]);

        const albumsData = await getArtistAlbums(deezerId, albumTab);

        const dataParsed = albumsData?.results ? albumsData.results : albumsData;
        setAlbums(Array.isArray(dataParsed) ? dataParsed : []);
      } catch (err) {
        console.error('Error cargando álbumes del artista:', err);
        setAlbums([]);
      } finally {
        setAlbumsLoading(false);
      }
    };

    fetchAlbumsForTab();
  }, [deezerId, albumTab]);

  const toggleFollow = useCallback(async () => {
    if (!artist || followLoading) return;

    const previousState = artist.is_following;
    setFollowLoading(true);

    setArtist((prev) => ({ ...prev, is_following: !previousState }));

    try {
      const data = await toggleFollowArtist(deezerId);
      setArtist((prev) => ({ ...prev, is_following: data.following }));
    } catch (err) {
      console.error('Error al actualizar el estado de seguir:', err);
      setArtist((prev) => ({ ...prev, is_following: previousState }));
    } finally {
      setFollowLoading(false);
    }
  }, [artist, deezerId, followLoading]);

  return {
    artist,
    songs,
    albums,
    albumsLoading,
    albumTab,
    setAlbumTab,
    loading,
    error,
    toggleFollow,
    followLoading,
  };
};
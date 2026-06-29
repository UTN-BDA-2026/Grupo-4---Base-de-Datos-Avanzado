import api from './api';

export const getRecentlyPlayed = async (limit = 20) => {
  const { data } = await api.get('/users/recently-played/', { params: { limit } });
  return data;
};

export const getTopArtists = async (limit = 20) => {
  const { data } = await api.get('/music/artists/top/', { params: { limit } });
  return data;
};

export const getTopAlbums = async (limit = 20) => {
  const { data } = await api.get('/music/albums/top/', { params: { limit } });
  return data;
};

export const getArtistDetail = async (deezerId) => {
  const { data } = await api.get(`/music/artists/${deezerId}/`);
  return data;
};

export const getArtistSongs = async (deezerId) => {
  const { data } = await api.get(`/music/artists/${deezerId}/songs/`);
  return data;
};

export const getArtistAlbums = async (deezerId, type = 'album') => {
  const { data } = await api.get(`/music/artists/${deezerId}/albums/`, { params: { type } });
  return data;
};

export const getAlbumDetail = async (deezerId) => {
  const { data } = await api.get(`/music/albums/${deezerId}/`);
  return data;
};

export const getAlbumSongs = async (deezerId) => {
  const { data } = await api.get(`/music/albums/${deezerId}/songs/`);
  return data;
};

export const searchAll = async (query, { type = 'all', limit = 20 } = {}) => {
  const { data } = await api.get('/music/search/', { params: { q: query, type, limit } });
  return data;
};

export const toggleSaveAlbum = async (deezerId) => {
  const { data } = await api.post(`/music/albums/${deezerId}/toggle-save/`);
  return data;
};

export const getSavedAlbums = async () => {
    const { data } = await api.get('/music/users/me/albums/');
    return data;
};

export const toggleFollowArtist = async (deezerId) => {
  const { data } = await api.post(`/music/artists/${deezerId}/follow/`);
  return data;
};

export const getFollowedArtists = async () => {
  const { data } = await api.get('/music/artists/followed/');
  return data;
};
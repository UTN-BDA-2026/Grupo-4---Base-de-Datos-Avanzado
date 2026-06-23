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
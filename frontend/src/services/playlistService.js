import api from './api';

export const getPlaylists = async () => {
  const { data } = await api.get('/playlists/');
  return data;
};

export const createPlaylist = async (playlistData) => {
  const { data } = await api.post('/playlists/', playlistData);
  return data;
};

export const getPlaylistDetail = async (playlistId) => {
  const { data } = await api.get(`/playlists/${playlistId}/`);
  return data;
};

export const updatePlaylist = async (playlistId, playlistData) => {
  const { data } = await api.put(`/playlists/${playlistId}/`, playlistData);
  return data;
};

export const deletePlaylist = async (playlistId) => {
  const { data } = await api.delete(`/playlists/${playlistId}/`);
  return data;
};

export const addSongToPlaylist = async (playlistId, songId) => {
  const { data } = await api.post(`/playlists/${playlistId}/songs/`, { song_id: songId });
  return data;
};

export const removeSongFromPlaylist = async (playlistId, songId) => {
  const { data } = await api.delete(`/playlists/${playlistId}/songs/${songId}/`);
  return data;
};
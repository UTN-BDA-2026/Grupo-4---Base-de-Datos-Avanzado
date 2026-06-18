import api from './api';

export const registerUser = async (userData) => {
  const { data } = await api.post('/users/register/', userData);
  return data;
};

export const loginUser = async (email, password) => {
  const { data } = await api.post('/users/login/', { email, password });
  return data;
};

export const logoutUser = async (refresh) => {
    const { data } = await api.post('/users/logout/', { refresh });
    return data;
};

export const getProfile = async () => {
  const { data } = await api.get('/users/profile/');
  return data;
};
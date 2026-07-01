import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

const onRefreshed = (newAccessToken) => {
    refreshSubscribers.forEach((callback) => callback(newAccessToken));
    refreshSubscribers = [];
};

const onRefreshFailed = () => {
    // Avisamos con null a todo el que estaba esperando el refresh,
    // así sus promesas hacen reject en vez de quedar colgadas.
    refreshSubscribers.forEach((callback) => callback(null));
    refreshSubscribers = [];
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    window.location.href = '/login';
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            // Evita reintentar infinitamente el propio /token/refresh/ si ese llegara a dar 401
            if (originalRequest.url?.includes('/token/refresh/')) {
                onRefreshFailed();
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            if (isRefreshing) {
                // Ya hay un refresh en curso: esperamos su resultado
                // en vez de disparar otro.
                return new Promise((resolve, reject) => {
                    subscribeTokenRefresh((newAccessToken) => {
                        if (!newAccessToken) {
                            reject(error);
                            return;
                        }
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        resolve(api(originalRequest));
                    });
                });
            }

            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem('refresh');
                if (!refreshToken) throw new Error('No hay refresh token');

                const { data } = await axios.post(`${API_URL}/token/refresh/`, {
                    refresh: refreshToken
                });

                localStorage.setItem('access', data.access);
                if (data.refresh) {
                    localStorage.setItem('refresh', data.refresh);
                }

                originalRequest.headers.Authorization = `Bearer ${data.access}`;
                isRefreshing = false;
                onRefreshed(data.access);

                return api(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                onRefreshFailed();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
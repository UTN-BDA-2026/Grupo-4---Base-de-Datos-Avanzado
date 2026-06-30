import { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, getProfile } from '../services/authService';

export const AuthContext = createContext(null);
const API_BASE_URL = 'http://localhost:8000/api'; // Asegúrate de que coincida con tu backend

// Función auxiliar para verificar si un token JWT está expirado
const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const { exp } = JSON.parse(jsonPayload);
        return Date.now() >= exp * 1000;
    } catch (e) {
        return true;
    }
};

// Función interna para refrescar el token de acceso al cargar la app
const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh');
    if (!refreshToken) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access', data.access);
            return data.access;
        }
    } catch (error) {
        console.error("Error al refrescar el token en AuthContext:", error);
    }
    return null;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            let token = localStorage.getItem('access');
            
            if (!token) {
                setLoading(false);
                return;
            }

            // CORRECCIÓN CRÍTICA: Si el token expiró tras cerrar la pestaña, intentamos renovarlo
            if (isTokenExpired(token)) {
                console.log("Token de acceso expirado al iniciar la app. Intentando renovar...");
                token = await refreshAccessToken();
                
                // Si tampoco se puede refrescar (porque pasaron los 7 días del refresh token), limpiamos y salimos
                if (!token) {
                    localStorage.removeItem('access');
                    localStorage.removeItem('refresh');
                    localStorage.removeItem('user');
                    setUser(null);
                    setLoading(false);
                    return;
                }
            }

            try {
                const freshUser = await getProfile();   // Ahora sí valida con un token 100% activo
                setUser(freshUser);
                localStorage.setItem('user', JSON.stringify(freshUser));
            } catch (err) {
                // Si el backend lo rechaza por otra razón de seguridad, limpiamos todo
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                localStorage.removeItem('user');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    const saveSession = (data) => {
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
    };

    const login = async (email, password) => {
        const data = await loginUser(email, password);
        saveSession(data);
        return data;
    };

    const register = async (formData) => {
        const data = await registerUser(formData);
        saveSession(data);
        return data;
    };

    const logout = async () => {
        const refresh = localStorage.getItem('refresh');
        try {
            if (refresh) await logoutUser(refresh);
        } catch (err) {
            console.warn('No se pudo invalidar el token en el backend:', err);
        } finally {
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

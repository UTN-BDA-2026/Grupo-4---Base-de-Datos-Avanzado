import { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, getProfile } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access');
            const refresh = localStorage.getItem('refresh');

            if (!token && !refresh) {
                setLoading(false);
                return;
            }

            try {
                const freshUser = await getProfile();
                setUser(freshUser);
                localStorage.setItem('user', JSON.stringify(freshUser));
            } catch (err) {

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
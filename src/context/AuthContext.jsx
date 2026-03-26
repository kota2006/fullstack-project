import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

// Create the context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('cert_app_token');
            const storedUser = localStorage.getItem('cert_app_user');

            if (token && storedUser) {
                try {
                    // Verify token is still valid by fetching current user
                    const userData = await api.getMe();
                    setUser(userData);
                    localStorage.setItem('cert_app_user', JSON.stringify(userData));
                } catch (error) {
                    // Token is invalid, clear everything
                    console.error('Token validation failed:', error);
                    localStorage.removeItem('cert_app_token');
                    localStorage.removeItem('cert_app_user');
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    // Login function
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('cert_app_user', JSON.stringify(userData));
    };

    // Logout function
    const logout = () => {
        setUser(null);
        api.logout();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

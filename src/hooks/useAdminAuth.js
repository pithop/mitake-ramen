import { useState, useEffect } from 'react';

export const useAdminAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = localStorage.getItem('mitake_admin_auth');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = () => {
        localStorage.setItem('mitake_admin_auth', 'true');
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('mitake_admin_auth');
        setIsAuthenticated(false);
    };

    return { isAuthenticated, loading, login, logout };
};

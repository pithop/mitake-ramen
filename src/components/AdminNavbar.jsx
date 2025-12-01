import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Flame, Settings, Truck, LogOut, WifiOff } from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';

const AdminNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAdminAuth();
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/'); // Redirect to login page (or home)
    };

    return (
        <nav className="bg-mitake-black border-b border-white/10 p-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center overflow-x-auto">
                <div className="flex items-center gap-6">
                    <h1 className="text-xl font-serif font-bold text-white hidden md:block">
                        Mitake <span className="text-mitake-gold">Admin</span>
                    </h1>

                    {!isOnline && (
                        <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                            <WifiOff size={16} />
                            <span className="hidden sm:inline">HORS LIGNE</span>
                        </div>
                    )}

                    <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                        <Link
                            to="/admin/kitchen"
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${isActive('/admin/kitchen')
                                ? 'bg-mitake-gold text-black font-bold'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Flame size={18} />
                            <span className="hidden sm:inline">Cuisine</span>
                        </Link>

                        <Link
                            to="/admin/manager"
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${isActive('/admin/manager')
                                ? 'bg-mitake-gold text-black font-bold'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Settings size={18} />
                            <span className="hidden sm:inline">Manager</span>
                        </Link>

                        <Link
                            to="/admin/delivery"
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${isActive('/admin/delivery')
                                ? 'bg-mitake-gold text-black font-bold'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Truck size={18} />
                            <span className="hidden sm:inline">Livreurs</span>
                        </Link>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-500 transition-colors p-2 flex items-center gap-2"
                    title="Déconnexion"
                >
                    <span className="hidden sm:inline text-sm font-bold">Déconnexion</span>
                    <LogOut size={20} />
                </button>
            </div>
        </nav>
    );
};

export default AdminNavbar;

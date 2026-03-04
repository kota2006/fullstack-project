import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Award, User, Home } from 'lucide-react';
import '../styles/AdminPanel.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    const isAdmin = user.role === 'admin';
    const isAdminRoute = location.pathname === '/admin';

    // Use spatial glass navbar on admin route, original on others
    if (isAdminRoute) {
        return (
            <nav className="spatial-navbar">
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
                        {/* Logo Section */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <Link
                                to="/admin"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: 'rgba(0, 255, 255, 0.06)',
                                    border: '1px solid rgba(0, 255, 255, 0.15)',
                                    boxShadow: '0 0 15px rgba(0, 255, 255, 0.08)'
                                }}>
                                    <Award size={20} style={{ color: '#00FFFF', filter: 'drop-shadow(0 0 4px rgba(0,255,255,0.4))' }} />
                                </div>
                                <div>
                                    <div className="holo-logo-text">CertTrack</div>
                                    <div className="holo-subtitle">Admin Panel</div>
                                </div>
                            </Link>

                            {/* Nav Links */}
                            <div className="hidden sm:flex" style={{ marginLeft: '1rem' }}>
                                <Link to="/admin" className="nav-link-spatial">
                                    <Home size={14} />
                                    Command Center
                                </Link>
                            </div>
                        </div>

                        {/* Right Side — Biometric Icons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Link
                                to="/profile"
                                className="biometric-icon"
                                title="Profile"
                                id="nav-profile-btn"
                            >
                                <User size={18} />
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="biometric-icon logout-icon"
                                title="Logout"
                                id="nav-logout-btn"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    // Default Navbar for non-admin pages
    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex-shrink-0 flex items-center">
                            <Award className="h-8 w-8 text-agri-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">CertTrack</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to={isAdmin ? '/admin' : '/dashboard'}
                                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                <Home className="w-4 h-4 mr-1" />
                                {isAdmin ? 'Admin Panel' : 'Dashboard'}
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/profile"
                            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                        >
                            <User className="h-5 w-5" />
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

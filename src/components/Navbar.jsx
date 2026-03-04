import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Award, User, Home, ShieldCheck, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;
    if (location.pathname === '/login') return null;

    const isAdmin = user.role === 'admin';
    const homePath = isAdmin ? '/admin' : '/dashboard';
    const homeLabel = isAdmin ? 'Command Center' : 'My Certs';
    const subtitleText = isAdmin ? 'Admin Panel' : 'Dashboard';

    return (
        <nav className="spatial-navbar">
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
                    {/* Logo Section */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <Link
                            to={homePath}
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
                                <div className="holo-subtitle">{subtitleText}</div>
                            </div>
                        </Link>

                        {/* Nav Links */}
                        <div style={{ display: 'flex', gap: '1.5rem', marginLeft: '1rem' }} className="hidden sm:flex">
                            <Link
                                to={homePath}
                                className={`nav-link-spatial ${location.pathname === homePath ? 'active' : ''}`}
                            >
                                {isAdmin ? <ShieldCheck size={14} /> : <LayoutDashboard size={14} />}
                                {homeLabel}
                            </Link>
                            <Link
                                to="/profile"
                                className={`nav-link-spatial ${location.pathname === '/profile' ? 'active' : ''}`}
                            >
                                <User size={14} />
                                Profile
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
};

export default Navbar;

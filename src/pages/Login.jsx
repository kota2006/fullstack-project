import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { Award, Lock, Mail } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const fillDemoData = (demoRole) => {
        if (demoRole === 'admin') {
            setEmail('admin@certapp.com');
            setPassword('password123');
            setRole('admin');
        } else {
            setEmail('student@certapp.com');
            setPassword('password123');
            setRole('user');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userData = await api.login(email, password);
            login(userData);
            toast.success('Successfully logged in!');
            if (userData.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error(error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-spatial-root">
            <div className="login-container animate-panel-in">
                {/* Logo Section */}
                <div className="login-logo-section">
                    <div className="login-logo-icon">
                        <Award size={32} />
                    </div>
                    <h1 className="login-title">CertTrack</h1>
                    <p className="login-subtitle">Professional Skill Certification Tracking</p>
                </div>

                {/* Login Card */}
                <div className="login-card animate-panel-in delay-2">
                    {/* Role Toggle */}
                    <div className="role-toggle-group">
                        <button
                            type="button"
                            onClick={() => fillDemoData('user')}
                            className={`role-toggle-btn ${role === 'user' ? 'active' : ''}`}
                            id="demo-student-btn"
                        >
                            Student Demo
                        </button>
                        <button
                            type="button"
                            onClick={() => fillDemoData('admin')}
                            className={`role-toggle-btn ${role === 'admin' ? 'active' : ''}`}
                            id="demo-admin-btn"
                        >
                            Admin Demo
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="glass-form-group">
                            <label htmlFor="email" className="glass-form-label">
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'rgba(160,170,190,0.4)',
                                    pointerEvents: 'none'
                                }} />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="glass-form-input"
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div className="glass-form-group">
                            <label htmlFor="password" className="glass-form-label">
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'rgba(160,170,190,0.4)',
                                    pointerEvents: 'none'
                                }} />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="glass-form-input"
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="prism-button prism-button-cyan"
                            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                            id="login-submit-btn"
                        >
                            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Shield, Save } from 'lucide-react';

const Profile = () => {
    const { user, login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: user?.password || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const updatedUser = await api.updateUser(user.id, formData);
            login({ ...updatedUser, password: formData.password });
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container">
            <div className="spatial-header-zone animate-panel-in" style={{ marginBottom: '1.5rem' }}>
                <h2 className="spatial-page-title">Profile Settings</h2>
            </div>

            <div className="profile-card animate-panel-in delay-2">
                {/* Header with avatar */}
                <div className="profile-card-header">
                    <div className="profile-avatar">
                        <User size={26} />
                    </div>
                    <div className="profile-info">
                        <h3>{user?.name}</h3>
                        <p>{user?.email}</p>
                        <span className="profile-role-badge">
                            <Shield size={10} />
                            {user?.role}
                        </span>
                    </div>
                </div>

                {/* Form Body */}
                <div className="profile-card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="profile-form-grid">
                            <div className="glass-form-group" style={{ marginBottom: 0 }}>
                                <label htmlFor="name" className="glass-form-label">
                                    Full Name
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <User size={16} style={{
                                        position: 'absolute',
                                        left: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'rgba(160,170,190,0.4)',
                                        pointerEvents: 'none'
                                    }} />
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="glass-form-input"
                                        style={{ paddingLeft: '2.5rem' }}
                                    />
                                </div>
                            </div>

                            <div className="glass-form-group" style={{ marginBottom: 0 }}>
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
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="glass-form-input"
                                        style={{ paddingLeft: '2.5rem' }}
                                    />
                                </div>
                            </div>

                            <div className="glass-form-group" style={{ marginBottom: 0 }}>
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
                                        type="password"
                                        name="password"
                                        id="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="glass-form-input"
                                        style={{ paddingLeft: '2.5rem' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="profile-form-actions">
                            <button
                                type="submit"
                                disabled={loading}
                                className="prism-button prism-button-cyan"
                                id="profile-save-btn"
                            >
                                <Save size={14} />
                                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;

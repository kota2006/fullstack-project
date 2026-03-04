import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import CertCard from '../components/CertCard';
import CertTable from '../components/CertTable';
import AddCertForm from '../components/AddCertForm';
import { LayoutGrid, List, Plus, Award } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [certifications, setCertifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchCerts = async () => {
        setLoading(true);
        try {
            const data = await api.getCertifications(user.id);
            setCertifications(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCerts();
    }, [user.id]);

    const handleAddSuccess = () => {
        setShowAddForm(false);
        fetchCerts();
    };

    if (loading) {
        return (
            <div className="spatial-content">
                <div className="spatial-loader">
                    <div className="spatial-spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="spatial-content">
            {/* Header Zone */}
            <div className="spatial-header-zone animate-panel-in">
                <h2 className="spatial-page-title">My Certifications</h2>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* View Toggle */}
                    <div className="view-toggle-group">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            id="view-grid-btn"
                        >
                            <LayoutGrid size={14} />
                            Grid
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                            id="view-table-btn"
                        >
                            <List size={14} />
                            Table
                        </button>
                    </div>

                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="prism-button prism-button-cyan"
                        id="add-cert-btn"
                    >
                        <Plus size={14} />
                        <span>Add New</span>
                    </button>
                </div>
            </div>

            {/* Add Form */}
            {showAddForm && (
                <div className="animate-panel-in delay-1">
                    <AddCertForm onSuccess={handleAddSuccess} onCancel={() => setShowAddForm(false)} />
                </div>
            )}

            {/* Content */}
            {viewMode === 'grid' ? (
                <div className="cert-grid-cards animate-panel-in delay-2">
                    {certifications.map((cert) => (
                        <CertCard key={cert.id} cert={cert} />
                    ))}
                    {certifications.length === 0 && (
                        <div className="empty-state-spatial" style={{ gridColumn: '1 / -1' }}>
                            <Award size={48} className="empty-icon" />
                            <h3>No Certifications Found</h3>
                            <p>Get started by adding a new certification.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="cert-data-grid glass-panel animate-panel-in delay-2">
                    <CertTable certifications={certifications} />
                </div>
            )}
        </div>
    );
};

export default Dashboard;

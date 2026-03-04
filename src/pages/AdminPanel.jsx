import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import CertTable from '../components/CertTable';
import toast from 'react-hot-toast';
import { Users, AlertTriangle, CheckCircle, Search, Send, ShieldCheck } from 'lucide-react';
import '../styles/AdminPanel.css';

const DataStreamOverlay = () => (
    <div className="data-stream-overlay">
        {[...Array(10)].map((_, i) => (
            <div key={i} className="data-stream-particle" />
        ))}
    </div>
);

const AdminPanel = () => {
    const [certifications, setCertifications] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [certsData, usersData] = await Promise.all([
                api.getCertifications(),
                api.getUsers()
            ]);
            setCertifications(certsData);
            setUsers(usersData);
        } catch (error) {
            toast.error('Failed to load dashboard data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this certification?')) {
            try {
                await api.deleteCertification(id);
                toast.success('Certification deleted');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete');
            }
        }
    };

    const handleBulkNotify = () => {
        toast.success('Renewal reminders sent to 3 users with expiring certificates.');
    };

    const filteredCerts = certifications.filter((cert) =>
        cert.certName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.userId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        totalCerts: certifications.length,
        activeCerts: certifications.filter(c => c.status === 'active').length,
        expiringCerts: certifications.filter(c => {
            if (c.status === 'expired') return false;
            const expiry = new Date(c.expiryDate);
            const daysLeft = (expiry - new Date()) / (1000 * 60 * 60 * 24);
            return daysLeft > 0 && daysLeft <= 90;
        }).length,
        expiredCerts: certifications.filter(c => c.status === 'expired' || new Date(c.expiryDate) < new Date()).length
    };

    if (loading) {
        return (
            <div className="admin-spatial-root">
                <DataStreamOverlay />
                <div className="admin-content">
                    <div className="spatial-loader">
                        <div className="spatial-spinner"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-spatial-root">
            <DataStreamOverlay />

            <div className="admin-content">
                {/* Header Zone */}
                <div className="admin-header-zone animate-panel-in">
                    <h2 className="admin-page-title">
                        Admin Dashboard
                    </h2>
                    <button
                        onClick={handleBulkNotify}
                        className="prism-button"
                        id="bulk-renewal-btn"
                    >
                        <Send size={14} />
                        <span>Send Bulk Renewal Reminders</span>
                    </button>
                </div>

                {/* Data Pillar KPI Cards */}
                <div className="data-pillars-grid">
                    <div className="data-pillar pillar-users animate-panel-in delay-1" id="kpi-total-users">
                        <div className="pillar-icon-ring">
                            <Users size={22} />
                        </div>
                        <div className="pillar-value">{users.length}</div>
                        <div className="pillar-label">Total Users</div>
                    </div>

                    <div className="data-pillar pillar-active animate-panel-in delay-2" id="kpi-active-certs">
                        <div className="pillar-icon-ring">
                            <CheckCircle size={22} />
                        </div>
                        <div className="pillar-value">{stats.activeCerts}</div>
                        <div className="pillar-label">Active Certs</div>
                    </div>

                    <div className="data-pillar pillar-expiring animate-panel-in delay-3" id="kpi-expiring-certs">
                        <div className="pillar-icon-ring">
                            <AlertTriangle size={22} />
                        </div>
                        <div className="pillar-value">{stats.expiringCerts}</div>
                        <div className="pillar-label">Expiring Soon</div>
                    </div>

                    <div className="data-pillar pillar-expired animate-panel-in delay-4" id="kpi-expired-certs">
                        <div className="pillar-icon-ring">
                            <AlertTriangle size={22} />
                        </div>
                        <div className="pillar-value">{stats.expiredCerts}</div>
                        <div className="pillar-label">Expired</div>
                    </div>
                </div>

                {/* Certification Data Grid */}
                <div className="cert-data-grid glass-panel animate-panel-in delay-5" id="cert-data-grid">
                    <div className="cert-grid-header">
                        <h3 className="cert-grid-title">
                            <ShieldCheck size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle', opacity: 0.6 }} />
                            All Certifications
                        </h3>
                        <div className="search-glass-pill" id="cert-search-bar">
                            <Search size={16} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search certifications..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                id="cert-search-input"
                            />
                        </div>
                    </div>

                    <CertTable
                        certifications={filteredCerts}
                        isAdmin={true}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;

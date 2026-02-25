import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import CertCard from '../components/CertCard';
import CertTable from '../components/CertTable';
import AddCertForm from '../components/AddCertForm';
import { LayoutGrid, List, Plus } from 'lucide-react';

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
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agri-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="md:flex md:items-center md:justify-between mb-6">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        My Certifications
                    </h2>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                    <div className="inline-flex rounded-md shadow-sm">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${viewMode === 'grid' ? 'bg-agri-50 text-agri-700 z-10' : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <LayoutGrid className="w-4 h-4 mr-2" />
                            Grid
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-l-0 border-gray-300 text-sm font-medium ${viewMode === 'table' ? 'bg-agri-50 text-agri-700 z-10' : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <List className="w-4 h-4 mr-2" />
                            Table
                        </button>
                    </div>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-agri-600 hover:bg-agri-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New
                    </button>
                </div>
            </div>

            {showAddForm && (
                <div className="mb-8">
                    <AddCertForm onSuccess={handleAddSuccess} onCancel={() => setShowAddForm(false)} />
                </div>
            )}

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {certifications.map((cert) => (
                        <CertCard key={cert.id} cert={cert} />
                    ))}
                    {certifications.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
                            <p className="text-gray-500">No certifications found. Add one to get started!</p>
                        </div>
                    )}
                </div>
            ) : (
                <CertTable certifications={certifications} />
            )}
        </div>
    );
};

export default Dashboard;

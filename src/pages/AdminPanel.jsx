import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import CertTable from '../components/CertTable';
import toast from 'react-hot-toast';
import { Users, AlertTriangle, CheckCircle, Search } from 'lucide-react';

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
        // Demo functionality
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
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agri-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Admin Dashboard
                    </h2>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    <button
                        onClick={handleBulkNotify}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Send Bulk Renewal Reminders
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">{users.length}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-agri-100 rounded-md p-3">
                                <CheckCircle className="h-6 w-6 text-agri-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Active Certs</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">{stats.activeCerts}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Expiring Soon</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">{stats.expiringCerts}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Expired</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">{stats.expiredCerts}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">All Certifications</h3>
                    <div className="relative rounded-md shadow-sm w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="focus:ring-agri-500 focus:border-agri-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md border py-2"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
    );
};

export default AdminPanel;

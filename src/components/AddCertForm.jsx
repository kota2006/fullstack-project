import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const AddCertForm = ({ onSuccess, onCancel }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        certName: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        certUrl: '',
        userId: user?.id || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.addCertification(formData);
            toast.success('Certification added successfully!');
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error('Failed to add certification');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add New Certification</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="certName" className="block text-sm font-medium text-gray-700">
                            Certification Name
                        </label>
                        <input
                            type="text"
                            name="certName"
                            id="certName"
                            required
                            value={formData.certName}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-agri-500 focus:ring-agri-500 sm:text-sm border p-2"
                            placeholder="e.g. AWS Certified Developer"
                        />
                    </div>

                    <div>
                        <label htmlFor="issuer" className="block text-sm font-medium text-gray-700">
                            Issuing Organization
                        </label>
                        <input
                            type="text"
                            name="issuer"
                            id="issuer"
                            required
                            value={formData.issuer}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-agri-500 focus:ring-agri-500 sm:text-sm border p-2"
                            placeholder="e.g. Amazon Web Services"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">
                                Issue Date
                            </label>
                            <input
                                type="date"
                                name="issueDate"
                                id="issueDate"
                                required
                                value={formData.issueDate}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-agri-500 focus:ring-agri-500 sm:text-sm border p-2"
                            />
                        </div>

                        <div>
                            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                                Expiry Date
                            </label>
                            <input
                                type="date"
                                name="expiryDate"
                                id="expiryDate"
                                required
                                value={formData.expiryDate}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-agri-500 focus:ring-agri-500 sm:text-sm border p-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="certUrl" className="block text-sm font-medium text-gray-700">
                            Certificate URL / File Link
                        </label>
                        <input
                            type="text"
                            name="certUrl"
                            id="certUrl"
                            value={formData.certUrl}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-agri-500 focus:ring-agri-500 sm:text-sm border p-2"
                            placeholder="https://..."
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agri-500"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-agri-600 hover:bg-agri-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agri-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Adding...' : 'Add Certification'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCertForm;

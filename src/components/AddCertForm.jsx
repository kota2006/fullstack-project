import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { Plus, X, FileText, Building, Calendar, Link as LinkIcon } from 'lucide-react';

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
        <div className="add-cert-panel">
            <h3 className="form-title">Add New Certification</h3>
            <form onSubmit={handleSubmit}>
                <div className="add-cert-grid">
                    <div className="glass-form-group" style={{ marginBottom: 0 }}>
                        <label htmlFor="certName" className="glass-form-label">
                            Certification Name
                        </label>
                        <div style={{ position: 'relative' }}>
                            <FileText size={16} style={{
                                position: 'absolute', left: '12px', top: '50%',
                                transform: 'translateY(-50%)', color: 'rgba(160,170,190,0.4)', pointerEvents: 'none'
                            }} />
                            <input
                                type="text"
                                name="certName"
                                id="certName"
                                required
                                value={formData.certName}
                                onChange={handleChange}
                                className="glass-form-input"
                                style={{ paddingLeft: '2.5rem' }}
                                placeholder="e.g. AWS Certified Developer"
                            />
                        </div>
                    </div>

                    <div className="glass-form-group" style={{ marginBottom: 0 }}>
                        <label htmlFor="issuer" className="glass-form-label">
                            Issuing Organization
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Building size={16} style={{
                                position: 'absolute', left: '12px', top: '50%',
                                transform: 'translateY(-50%)', color: 'rgba(160,170,190,0.4)', pointerEvents: 'none'
                            }} />
                            <input
                                type="text"
                                name="issuer"
                                id="issuer"
                                required
                                value={formData.issuer}
                                onChange={handleChange}
                                className="glass-form-input"
                                style={{ paddingLeft: '2.5rem' }}
                                placeholder="e.g. Amazon Web Services"
                            />
                        </div>
                    </div>

                    <div className="add-cert-grid add-cert-grid-2col" style={{ gap: '1.25rem' }}>
                        <div className="glass-form-group" style={{ marginBottom: 0 }}>
                            <label htmlFor="issueDate" className="glass-form-label">
                                Issue Date
                            </label>
                            <input
                                type="date"
                                name="issueDate"
                                id="issueDate"
                                required
                                value={formData.issueDate}
                                onChange={handleChange}
                                className="glass-form-input"
                            />
                        </div>

                        <div className="glass-form-group" style={{ marginBottom: 0 }}>
                            <label htmlFor="expiryDate" className="glass-form-label">
                                Expiry Date
                            </label>
                            <input
                                type="date"
                                name="expiryDate"
                                id="expiryDate"
                                required
                                value={formData.expiryDate}
                                onChange={handleChange}
                                className="glass-form-input"
                            />
                        </div>
                    </div>

                    <div className="glass-form-group" style={{ marginBottom: 0 }}>
                        <label htmlFor="certUrl" className="glass-form-label">
                            Certificate URL / File Link
                        </label>
                        <div style={{ position: 'relative' }}>
                            <LinkIcon size={16} style={{
                                position: 'absolute', left: '12px', top: '50%',
                                transform: 'translateY(-50%)', color: 'rgba(160,170,190,0.4)', pointerEvents: 'none'
                            }} />
                            <input
                                type="text"
                                name="certUrl"
                                id="certUrl"
                                value={formData.certUrl}
                                onChange={handleChange}
                                className="glass-form-input"
                                style={{ paddingLeft: '2.5rem' }}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </div>

                <div className="add-cert-actions">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="ghost-button"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="prism-button prism-button-cyan"
                    >
                        <Plus size={14} />
                        <span>{loading ? 'Adding...' : 'Add Certification'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCertForm;

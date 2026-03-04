import React from 'react';
import { differenceInDays, parseISO } from 'date-fns';
import { Download, AlertCircle, Edit, Trash2 } from 'lucide-react';

const CertTable = ({ certifications, isAdmin = false, onDelete }) => {
    if (!certifications || certifications.length === 0) {
        return (
            <div className="empty-state-spatial">
                <AlertCircle className="empty-icon" size={48} />
                <h3>No Certifications Found</h3>
                <p>Get started by adding a new certification.</p>
            </div>
        );
    }

    return (
        <div className="table-scroll-wrapper">
            <table className="spatial-table">
                <thead>
                    <tr>
                        <th>Certification Details</th>
                        {isAdmin && <th>User ID</th>}
                        <th>Dates</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {certifications.map((cert) => {
                        const expiryDate = parseISO(cert.expiryDate);
                        const daysLeft = differenceInDays(expiryDate, new Date());

                        let statusClass = 'status-active';
                        let statusText = 'Active';

                        if (daysLeft < 0 || cert.status === 'expired') {
                            statusClass = 'status-expired';
                            statusText = 'Expired';
                        } else if (daysLeft <= 30) {
                            statusClass = 'status-expiring';
                            statusText = 'Expiring Soon';
                        } else if (daysLeft <= 90) {
                            statusClass = 'status-renewal';
                            statusText = 'Needs Renewal';
                        }

                        return (
                            <tr key={cert.id}>
                                <td>
                                    <div className="cert-name">{cert.certName}</div>
                                    <div className="cert-issuer">{cert.issuer}</div>
                                </td>
                                {isAdmin && (
                                    <td>
                                        <span className="cert-user-id">{cert.userId}</span>
                                    </td>
                                )}
                                <td>
                                    <div>
                                        <div className="cert-date-label">Issued</div>
                                        <div className="cert-date">{cert.issueDate}</div>
                                    </div>
                                    <div style={{ marginTop: '6px' }}>
                                        <div className="cert-date-label">Expires</div>
                                        <div className="cert-date">{cert.expiryDate}</div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`status-capsule ${statusClass}`}>
                                        {statusText}
                                    </span>
                                </td>
                                <td>
                                    <div className="hud-actions">
                                        <a
                                            href={cert.certUrl !== '#' ? cert.certUrl : '#'}
                                            className="hud-icon hud-download"
                                            title="Download"
                                        >
                                            <Download size={15} />
                                        </a>
                                        {isAdmin && (
                                            <>
                                                <button
                                                    className="hud-icon hud-edit"
                                                    title="Edit"
                                                >
                                                    <Edit size={15} />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(cert.id)}
                                                    className="hud-icon hud-delete"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default CertTable;

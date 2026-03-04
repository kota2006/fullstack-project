import React from 'react';
import { Calendar, FileText, Download } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

const CertCard = ({ cert }) => {
    const expiryDate = parseISO(cert.expiryDate);
    const today = new Date();
    const daysLeft = differenceInDays(expiryDate, today);

    let statusClass = 'status-active';
    let statusText = 'Active';

    if (daysLeft < 0 || cert.status === 'expired') {
        statusClass = 'status-expired';
        statusText = 'Expired';
    } else if (daysLeft <= 30) {
        statusClass = 'status-expiring';
        statusText = `Expiring (${daysLeft}d)`;
    } else if (daysLeft <= 90) {
        statusClass = 'status-renewal';
        statusText = `Expiring Soon (${daysLeft}d)`;
    }

    return (
        <div className="glass-cert-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="card-title" title={cert.certName}>
                        {cert.certName}
                    </div>
                    <div className="card-issuer">
                        <FileText size={13} style={{ flexShrink: 0 }} />
                        {cert.issuer}
                    </div>
                </div>
                <span className={`status-capsule ${statusClass}`} style={{ flexShrink: 0 }}>
                    {statusText}
                </span>
            </div>

            <div className="card-dates">
                <div className="date-block">
                    <div className="date-label">
                        <Calendar size={10} />
                        Issued
                    </div>
                    <div className="date-value">{cert.issueDate}</div>
                </div>
                <div className="date-block">
                    <div className="date-label">
                        <Calendar size={10} />
                        Expires
                    </div>
                    <div className="date-value">{cert.expiryDate}</div>
                </div>
            </div>

            <a
                href={cert.certUrl !== '#' ? cert.certUrl : '#'}
                className="card-download-btn"
                onClick={(e) => {
                    if (cert.certUrl === '#') {
                        e.preventDefault();
                        alert('Demo: Certificate document not available');
                    }
                }}
            >
                <Download size={15} />
                View Certificate
            </a>
        </div>
    );
};

export default CertCard;

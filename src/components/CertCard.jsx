import React from 'react';
import { Calendar, FileText, Download } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

const CertCard = ({ cert }) => {
    const expiryDate = parseISO(cert.expiryDate);
    const today = new Date();
    const daysLeft = differenceInDays(expiryDate, today);

    let statusColor = "bg-agri-100 text-agri-800";
    let statusBadge = "Active";

    if (daysLeft < 0 || cert.status === 'expired') {
        statusColor = "bg-red-100 text-red-800";
        statusBadge = "Expired";
    } else if (daysLeft <= 30) {
        statusColor = "bg-red-100 text-red-800";
        statusBadge = `Expiring (${daysLeft}d)`;
    } else if (daysLeft <= 90) {
        statusColor = "bg-yellow-100 text-yellow-800";
        statusBadge = `Expiring Soon (${daysLeft}d)`;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="p-5">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2" title={cert.certName}>
                            {cert.certName}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            {cert.issuer}
                        </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${statusColor}`}>
                        {statusBadge}
                    </span>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-gray-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Issued
                        </p>
                        <p className="text-sm font-medium text-gray-900">{cert.issueDate}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Expires
                        </p>
                        <p className="text-sm font-medium text-gray-900">{cert.expiryDate}</p>
                    </div>
                </div>

                <div className="mt-5 flex">
                    <a
                        href={cert.certUrl !== '#' ? cert.certUrl : '#'}
                        className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-md text-sm text-center flex items-center justify-center transition-colors"
                        onClick={(e) => {
                            if (cert.certUrl === '#') {
                                e.preventDefault();
                                alert('Demo: Certificate document not available');
                            }
                        }}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        View Certificate
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CertCard;

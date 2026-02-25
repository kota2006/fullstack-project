import React from 'react';
import { differenceInDays, parseISO } from 'date-fns';
import { Download, AlertCircle, Edit, Trash2 } from 'lucide-react';

const CertTable = ({ certifications, isAdmin = false, onDelete }) => {
    if (!certifications || certifications.length === 0) {
        return (
            <div className="bg-white px-4 py-5 sm:p-6 text-center rounded-lg shadow-sm border border-gray-200">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No certifications</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a new certification.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Certification Details
                                    </th>
                                    {isAdmin && (
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User ID
                                        </th>
                                    )}
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Dates
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="relative px-6 py-3 text-right">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {certifications.map((cert) => {
                                    const expiryDate = parseISO(cert.expiryDate);
                                    const daysLeft = differenceInDays(expiryDate, new Date());

                                    let badgeColors = "bg-agri-100 text-agri-800";
                                    let statusText = "Active";

                                    if (daysLeft < 0 || cert.status === 'expired') {
                                        badgeColors = "bg-red-100 text-red-800";
                                        statusText = "Expired";
                                    } else if (daysLeft <= 30) {
                                        badgeColors = "bg-red-100 text-red-800";
                                        statusText = "Expiring Soon";
                                    } else if (daysLeft <= 90) {
                                        badgeColors = "bg-yellow-100 text-yellow-800";
                                        statusText = "Needs Renewal";
                                    }

                                    return (
                                        <tr key={cert.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{cert.certName}</div>
                                                        <div className="text-sm text-gray-500">{cert.issuer}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            {isAdmin && (
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {cert.userId}
                                                </td>
                                            )}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">Issued: {cert.issueDate}</div>
                                                <div className="text-sm text-gray-500">Expires: {cert.expiryDate}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeColors}`}>
                                                    {statusText}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <a href={cert.certUrl !== '#' ? cert.certUrl : '#'} className="text-agri-600 hover:text-agri-900" title="Download">
                                                        <Download className="w-5 h-5" />
                                                    </a>
                                                    {isAdmin && (
                                                        <>
                                                            <button className="text-blue-600 hover:text-blue-900" title="Edit">
                                                                <Edit className="w-5 h-5" />
                                                            </button>
                                                            <button onClick={() => onDelete(cert.id)} className="text-red-600 hover:text-red-900" title="Delete">
                                                                <Trash2 className="w-5 h-5" />
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
                </div>
            </div>
        </div>
    );
};

export default CertTable;

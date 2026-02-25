export const mockUsers = [
    {
        id: 'u1',
        name: 'Admin User',
        email: 'admin@certapp.com',
        role: 'admin',
        password: 'password123'
    },
    {
        id: 'u2',
        name: 'Regular Student',
        email: 'student@certapp.com',
        role: 'user',
        password: 'password123'
    }
];

export const mockCertifications = [
    {
        id: 'c1',
        userId: 'u2',
        certName: 'AWS Certified Developer Associate',
        issuer: 'Amazon Web Services',
        issueDate: '2023-05-01',
        expiryDate: '2027-05-01',
        certUrl: '#',
        status: 'active'
    },
    {
        id: 'c2',
        userId: 'u2',
        certName: 'CompTIA Security+',
        issuer: 'CompTIA',
        issueDate: '2021-03-15',
        expiryDate: '2024-03-15',
        certUrl: '#',
        status: 'expired'
    },
    {
        id: 'c3',
        userId: 'u2',
        certName: 'Certified Kubernetes Administrator',
        issuer: 'Cloud Native Computing Foundation',
        issueDate: '2022-11-20',
        expiryDate: '2026-11-20',
        certUrl: '#',
        status: 'active'
    },
    {
        id: 'c4',
        userId: 'u2',
        certName: 'Google Cloud Professional Cloud Architect',
        issuer: 'Google',
        issueDate: '2024-01-10',
        expiryDate: '2026-01-10',
        certUrl: '#',
        status: 'active'
    },
    {
        id: 'c5',
        userId: 'u2',
        certName: 'Microsoft Certified: Azure Fundamentals',
        issuer: 'Microsoft',
        issueDate: '2023-08-05',
        expiryDate: '2025-08-05',
        certUrl: '#',
        status: 'active'
    },
    {
        id: 'c6',
        userId: 'u2',
        certName: 'Cisco Certified Network Associate (CCNA)',
        issuer: 'Cisco',
        issueDate: '2021-06-12',
        expiryDate: '2024-06-12',
        certUrl: '#',
        status: 'expired'
    },
    {
        id: 'c7',
        userId: 'u2',
        certName: 'Certified ScrumMaster (CSM)',
        issuer: 'Scrum Alliance',
        issueDate: '2024-02-18',
        expiryDate: '2026-02-18',
        certUrl: '#',
        status: 'active'
    },
    {
        id: 'c8',
        userId: 'u2',
        certName: 'Project Management Professional (PMP)',
        issuer: 'PMI',
        issueDate: '2022-09-30',
        expiryDate: '2025-09-30',
        certUrl: '#',
        status: 'active'
    },
    {
        id: 'c9',
        userId: 'u2',
        certName: 'ITIL Foundations',
        issuer: 'Axelos',
        issueDate: '2020-04-22',
        expiryDate: '2026-04-22', // Assuming no expiration but setting one for example
        certUrl: '#',
        status: 'active'
    },
    {
        id: 'c10',
        userId: 'u2',
        certName: 'Oracle Certified Professional, Java SE 11 Developer',
        issuer: 'Oracle',
        issueDate: '2021-12-05',
        expiryDate: '2026-12-05',
        certUrl: '#',
        status: 'active'
    },
    {
        id: 'c11',
        userId: 'u2',
        certName: 'Certified Ethical Hacker (CEH)',
        issuer: 'EC-Council',
        issueDate: '2022-07-14',
        expiryDate: '2025-07-14',
        certUrl: '#',
        status: 'active'
    }
];

// Initialize local storage with mock data if empty
export const initializeData = () => {
    if (!localStorage.getItem('cert_app_users')) {
        localStorage.setItem('cert_app_users', JSON.stringify(mockUsers));
    }
    if (!localStorage.getItem('cert_app_certs')) {
        localStorage.setItem('cert_app_certs', JSON.stringify(mockCertifications));
    }
};

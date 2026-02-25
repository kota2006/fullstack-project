import { initializeData } from '../data/mockCertifications';

// Initialize mock data in local storage
initializeData();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
    // Auth
    login: async (email, password) => {
        await delay(500); // Simulate network latency
        const users = JSON.parse(localStorage.getItem('cert_app_users') || '[]');
        const user = users.find((u) => u.email === email && u.password === password);
        if (!user) throw new Error('Invalid credentials');

        // Don't leak password
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    },

    // Users
    getUsers: async () => {
        await delay(300);
        return JSON.parse(localStorage.getItem('cert_app_users') || '[]');
    },

    updateUser: async (id, data) => {
        await delay(300);
        const users = JSON.parse(localStorage.getItem('cert_app_users') || '[]');
        const index = users.findIndex((u) => u.id === id);
        if (index === -1) throw new Error('User not found');

        users[index] = { ...users[index], ...data };
        localStorage.setItem('cert_app_users', JSON.stringify(users));
        return users[index];
    },

    // Certifications
    getCertifications: async (userId = null) => {
        await delay(400);
        const certs = JSON.parse(localStorage.getItem('cert_app_certs') || '[]');
        if (userId) {
            return certs.filter((c) => c.userId === userId);
        }
        return certs;
    },

    addCertification: async (certData) => {
        await delay(600);
        const certs = JSON.parse(localStorage.getItem('cert_app_certs') || '[]');
        const newCert = {
            ...certData,
            id: `c${Date.now()}`,
            status: 'active' // Simplified status logic for mock
        };
        certs.push(newCert);
        localStorage.setItem('cert_app_certs', JSON.stringify(certs));
        return newCert;
    },

    updateCertification: async (id, data) => {
        await delay(400);
        const certs = JSON.parse(localStorage.getItem('cert_app_certs') || '[]');
        const index = certs.findIndex((c) => c.id === id);
        if (index === -1) throw new Error('Certification not found');

        certs[index] = { ...certs[index], ...data };
        localStorage.setItem('cert_app_certs', JSON.stringify(certs));
        return certs[index];
    },

    deleteCertification: async (id) => {
        await delay(400);
        const certs = JSON.parse(localStorage.getItem('cert_app_certs') || '[]');
        const filtered = certs.filter((c) => c.id !== id);
        localStorage.setItem('cert_app_certs', JSON.stringify(filtered));
        return true;
    }
};

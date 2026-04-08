import { mockUsers, mockCertifications, initializeData } from '../data/mockCertifications';

const API_BASE = import.meta.env.VITE_API_URL || '';

// Determine if we should use the mock/localStorage backend
const USE_MOCK = !API_BASE || API_BASE.includes('YOUR-BACKEND') || API_BASE.includes('localhost');

// Initialize mock data in localStorage on first load
if (USE_MOCK) {
    initializeData();
}

// ─── Helper functions for localStorage mock backend ─────────────────────

const getStoredUsers = () => JSON.parse(localStorage.getItem('cert_app_users') || '[]');
const getStoredCerts = () => JSON.parse(localStorage.getItem('cert_app_certs') || '[]');
const saveUsers = (users) => localStorage.setItem('cert_app_users', JSON.stringify(users));
const saveCerts = (certs) => localStorage.setItem('cert_app_certs', JSON.stringify(certs));

// Simulate async delay for realism
const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Real backend HTTP helpers ──────────────────────────────────────────

const getToken = () => localStorage.getItem('cert_app_token');

const request = async (endpoint, options = {}) => {
    const token = getToken();
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers
        },
        ...options
    };

    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
};

// ─── Mock API implementation (localStorage-based) ───────────────────────

const mockApi = {
    login: async (email, password) => {
        await delay();
        const users = getStoredUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const fakeToken = btoa(JSON.stringify({ id: user.id, email: user.email, role: user.role }));
        localStorage.setItem('cert_app_token', fakeToken);
        return { id: user.id, name: user.name, email: user.email, role: user.role };
    },

    register: async (name, email, password) => {
        await delay();
        const users = getStoredUsers();
        if (users.find(u => u.email === email)) {
            throw new Error('User already exists');
        }
        const newUser = {
            id: 'u' + Date.now(),
            name,
            email,
            role: 'user',
            password
        };
        users.push(newUser);
        saveUsers(users);
        const fakeToken = btoa(JSON.stringify({ id: newUser.id, email: newUser.email, role: newUser.role }));
        localStorage.setItem('cert_app_token', fakeToken);
        return { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
    },

    getMe: async () => {
        await delay();
        const token = getToken();
        if (!token) throw new Error('Not authenticated');
        try {
            const payload = JSON.parse(atob(token));
            const users = getStoredUsers();
            const user = users.find(u => u.id === payload.id);
            if (!user) throw new Error('User not found');
            return { id: user.id, name: user.name, email: user.email, role: user.role };
        } catch {
            throw new Error('Invalid token');
        }
    },

    logout: () => {
        localStorage.removeItem('cert_app_token');
        localStorage.removeItem('cert_app_user');
    },

    getUsers: async () => {
        await delay();
        const users = getStoredUsers();
        return users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role }));
    },

    updateUser: async (id, userData) => {
        await delay();
        const users = getStoredUsers();
        const idx = users.findIndex(u => u.id === id);
        if (idx === -1) throw new Error('User not found');
        users[idx] = { ...users[idx], ...userData };
        saveUsers(users);
        const u = users[idx];
        return { id: u.id, name: u.name, email: u.email, role: u.role };
    },

    getCertifications: async (userId = null) => {
        await delay();
        let certs = getStoredCerts();
        if (userId) {
            certs = certs.filter(c => c.userId === userId);
        }
        // If user is not admin, filter to their own certs
        const token = getToken();
        if (token) {
            try {
                const payload = JSON.parse(atob(token));
                const users = getStoredUsers();
                const currentUser = users.find(u => u.id === payload.id);
                if (currentUser && currentUser.role !== 'admin') {
                    certs = certs.filter(c => c.userId === currentUser.id);
                }
            } catch { /* ignore */ }
        }
        return certs;
    },

    addCertification: async (certData) => {
        await delay();
        const certs = getStoredCerts();
        const token = getToken();
        let userId = certData.userId;
        if (!userId && token) {
            try {
                const payload = JSON.parse(atob(token));
                userId = payload.id;
            } catch { /* ignore */ }
        }
        const newCert = {
            id: 'c' + Date.now(),
            userId: userId,
            ...certData,
            status: new Date(certData.expiryDate) < new Date() ? 'expired' : 'active'
        };
        certs.push(newCert);
        saveCerts(certs);
        return newCert;
    },

    updateCertification: async (id, certData) => {
        await delay();
        const certs = getStoredCerts();
        const idx = certs.findIndex(c => c.id === id);
        if (idx === -1) throw new Error('Certification not found');
        certs[idx] = { ...certs[idx], ...certData };
        if (certData.expiryDate) {
            certs[idx].status = new Date(certData.expiryDate) < new Date() ? 'expired' : 'active';
        }
        saveCerts(certs);
        return certs[idx];
    },

    deleteCertification: async (id) => {
        await delay();
        let certs = getStoredCerts();
        certs = certs.filter(c => c.id !== id);
        saveCerts(certs);
        return true;
    }
};

// ─── Real backend API implementation ────────────────────────────────────

const realApi = {
    login: async (email, password) => {
        const data = await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        localStorage.setItem('cert_app_token', data.token);
        return data.user;
    },

    register: async (name, email, password) => {
        const data = await request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });
        localStorage.setItem('cert_app_token', data.token);
        return data.user;
    },

    getMe: async () => {
        const data = await request('/auth/me');
        return data.user;
    },

    logout: () => {
        localStorage.removeItem('cert_app_token');
        localStorage.removeItem('cert_app_user');
    },

    getUsers: async () => {
        const data = await request('/users');
        return data.users;
    },

    updateUser: async (id, userData) => {
        const data = await request(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
        return data.user;
    },

    getCertifications: async (userId = null) => {
        const query = userId ? `?userId=${userId}` : '';
        const data = await request(`/certifications${query}`);
        return data.certifications;
    },

    addCertification: async (certData) => {
        const data = await request('/certifications', {
            method: 'POST',
            body: JSON.stringify(certData)
        });
        return data.certification;
    },

    updateCertification: async (id, certData) => {
        const data = await request(`/certifications/${id}`, {
            method: 'PUT',
            body: JSON.stringify(certData)
        });
        return data.certification;
    },

    deleteCertification: async (id) => {
        await request(`/certifications/${id}`, {
            method: 'DELETE'
        });
        return true;
    }
};

// ─── Export the appropriate API based on environment ─────────────────────

export const api = USE_MOCK ? mockApi : realApi;

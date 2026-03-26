const API_BASE = 'http://localhost:5000/api';

// Helper to get auth token
const getToken = () => localStorage.getItem('cert_app_token');

// Helper for API requests
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

export const api = {
    // ─── Auth ────────────────────────────────────────────────
    login: async (email, password) => {
        const data = await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        // Store token
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

    // ─── Users ───────────────────────────────────────────────
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

    // ─── Certifications ──────────────────────────────────────
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

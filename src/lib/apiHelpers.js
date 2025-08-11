// src/lib/apiHelpers.js
// Helper functions for making API calls from the frontend

const API_BASE = process.env.NODE_ENV === 'production'
    ? 'https://your-domain.com'
    : 'http://localhost:3000';

// Public API helpers
export const api = {
    // Get all active offers
    async getOffers() {
        const response = await fetch(`${API_BASE}/api/offers`);
        return response.json();
    },

    // Create or get lead
    async createLead() {
        const response = await fetch(`${API_BASE}/api/leads`, {
            method: 'POST',
        });
        return response.json();
    },

    // Get existing lead
    async getLead() {
        const response = await fetch(`${API_BASE}/api/leads`);
        return response.json();
    },

    // Log user action
    async logAction(leadId, actionType, offerId = null, offerPosition = null, metadata = null) {
        const response = await fetch(`${API_BASE}/api/actions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                leadId,
                actionType,
                offerId,
                offerPosition,
                metadata,
            }),
        });
        return response.json();
    },

    // Get actions for a lead
    async getActions(leadId = null, actionType = null) {
        const params = new URLSearchParams();
        if (leadId) params.append('leadId', leadId);
        if (actionType) params.append('actionType', actionType);

        const response = await fetch(`${API_BASE}/api/actions?${params.toString()}`);
        return response.json();
    },
};

// Admin API helpers (require authentication)
export const adminApi = {
    // Create auth header
    getAuthHeader(username = 'admin', password = 'admin123') {
        const credentials = Buffer.from(`${username}:${password}`).toString('base64');
        return { 'Authorization': `Basic ${credentials}` };
    },

    // Get all offers (admin view)
    async getOffers(username, password) {
        const response = await fetch(`${API_BASE}/api/admin/offers`, {
            headers: this.getAuthHeader(username, password),
        });
        return response.json();
    },

    // Create new offer
    async createOffer(offerData, username, password) {
        const response = await fetch(`${API_BASE}/api/admin/offers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeader(username, password),
            },
            body: JSON.stringify(offerData),
        });
        return response.json();
    },

    // Update offer
    async updateOffer(offerId, updateData, username, password) {
        const response = await fetch(`${API_BASE}/api/admin/offers/${offerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeader(username, password),
            },
            body: JSON.stringify(updateData),
        });
        return response.json();
    },

    // Delete offer
    async deleteOffer(offerId, username, password) {
        const response = await fetch(`${API_BASE}/api/admin/offers/${offerId}`, {
            method: 'DELETE',
            headers: this.getAuthHeader(username, password),
        });
        return response.json();
    },

    // Reorder offers
    async reorderOffers(offerIds, username, password) {
        const response = await fetch(`${API_BASE}/api/admin/offers/reorder`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeader(username, password),
            },
            body: JSON.stringify({ offerIds }),
        });
        return response.json();
    },
};

// Action types constants
export const ACTION_TYPES = {
    VIEW: 'PATH_VIEW',
    DECLINE: 'PATH_DECLINE',
    SUBMIT: 'PATH_SUBMIT',
};
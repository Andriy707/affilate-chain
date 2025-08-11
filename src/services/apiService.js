// src/services/apiService.js
const API_BASE = '';

export const apiService = {
    // Get all active offers
    async getOffers() {
        try {
            const response = await fetch(`${API_BASE}/api/offers`);
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to fetch offers');
            }

            return data.data;
        } catch (error) {
            console.error('Error fetching offers:', error);
            throw error;
        }
    },

    // Create or get lead for current user
    async getOrCreateLead() {
        try {
            // Try to get existing lead first
            let response = await fetch(`${API_BASE}/api/leads`);
            let data = await response.json();

            // If no lead exists, create one
            if (!data.success) {
                response = await fetch(`${API_BASE}/api/leads`, {
                    method: 'POST',
                });
                data = await response.json();
            }

            if (!data.success) {
                throw new Error(data.error || 'Failed to get/create lead');
            }

            return data.data;
        } catch (error) {
            console.error('Error with lead:', error);
            throw error;
        }
    },

    // Log user action
    async logAction(leadId, actionType, offerId = null, offerPosition = null, metadata = null) {
        try {
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

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to log action');
            }

            return data.data;
        } catch (error) {
            console.error('Error logging action:', error);
            throw error;
        }
    },
};

// Action types
export const ACTION_TYPES = {
    VIEW: 'PATH_VIEW',
    DECLINE: 'PATH_DECLINE',
    SUBMIT: 'PATH_SUBMIT',
};
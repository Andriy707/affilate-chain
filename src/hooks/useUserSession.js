// src/hooks/useUserSession.js
import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';

export function useUserSession() {
    const [leadId, setLeadId] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeSession = async () => {
            try {
                setLoading(true);

                // Generate a session ID for this browser session
                const newSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                setSessionId(newSessionId);

                // Get or create lead
                const leadData = await apiService.getOrCreateLead();
                setLeadId(leadData.leadId);

                console.log('Session initialized:', {
                    leadId: leadData.leadId,
                    sessionId: newSessionId,
                    isNewLead: leadData.isNewLead
                });

                setLoading(false);
            } catch (err) {
                console.error('Session initialization error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        initializeSession();
    }, []);

    // Track action helper
    const trackAction = async (actionType, offerId = null, offerPosition = null, metadata = {}) => {
        if (!leadId) {
            console.warn('Cannot track action: leadId not available');
            return;
        }

        try {
            const enrichedMetadata = {
                ...metadata,
                sessionId,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href,
                referrer: document.referrer,
            };

            const result = await apiService.logAction(
                leadId,
                actionType,
                offerId,
                offerPosition,
                enrichedMetadata
            );

            console.log('Action tracked:', {
                actionType,
                offerId,
                offerPosition,
                actionId: result.actionId
            });

            return result;
        } catch (err) {
            console.error('Failed to track action:', err);
        }
    };

    return {
        leadId,
        sessionId,
        loading,
        error,
        trackAction,
    };
}
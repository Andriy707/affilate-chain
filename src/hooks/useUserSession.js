// src/hooks/useUserSession.js - IMPROVED VERSION
import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';

export function useUserSession() {
    const [leadId, setLeadId] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [debugInfo, setDebugInfo] = useState({});

    useEffect(() => {
        const initializeSession = async () => {
            try {
                setLoading(true);

                // ALWAYS generate a new session ID for each page load/refresh
                const newSessionId = crypto.randomUUID();
                setSessionId(newSessionId);

                console.log(`🆔 Generated NEW Session ID: ${newSessionId.slice(0, 8)}...`);

                // Get or create lead (this might be the same across browser sessions)
                const leadData = await apiService.getOrCreateLead();
                setLeadId(leadData.leadId);

                const debugInfo = {
                    sessionId: newSessionId,
                    leadId: leadData.leadId,
                    isNewLead: leadData.isNewLead,
                    clientIP: leadData.clientIP, // Only shown in development
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent.slice(0, 50) + '...'
                };

                setDebugInfo(debugInfo);

                console.log('🚀 Session initialized:', {
                    sessionId: `${newSessionId.slice(0, 8)}...`,
                    leadId: `${leadData.leadId.slice(0, 8)}...`,
                    isNewLead: leadData.isNewLead,
                    clientIP: leadData.clientIP,
                });

                // Additional check to ensure session ID is actually different
                const previousSessionId = window.sessionStorage.getItem('lastSessionId');
                if (previousSessionId && previousSessionId === newSessionId) {
                    console.warn('⚠️ Session ID collision detected! This should never happen.');
                } else {
                    console.log(`✅ Session ID is unique. Previous: ${previousSessionId?.slice(0, 8) || 'none'}...`);
                }

                // Store for comparison (not for persistence)
                window.sessionStorage.setItem('lastSessionId', newSessionId);

                setLoading(false);
            } catch (err) {
                console.error('❌ Session initialization error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        initializeSession();
    }, []); // Empty dependency array = runs once per component mount

    // Track action helper with enhanced logging
    const trackAction = async (actionType, offerId = null, offerPosition = null, metadata = {}) => {
        if (!leadId) {
            console.warn('⚠️ Cannot track action: leadId not available');
            return;
        }

        if (!sessionId) {
            console.warn('⚠️ Cannot track action: sessionId not available');
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
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            };

            const result = await apiService.logAction(
                leadId,
                actionType,
                offerId,
                offerPosition,
                enrichedMetadata
            );

            console.log('📊 Action tracked:', {
                actionType,
                offerId: offerId ? `${offerId.slice(0, 8)}...` : null,
                offerPosition,
                actionId: `${result.actionId.slice(0, 8)}...`,
                sessionId: `${sessionId.slice(0, 8)}...`,
                leadId: `${leadId.slice(0, 8)}...`
            });

            return result;
        } catch (err) {
            console.error('❌ Failed to track action:', err);
            throw err; // Re-throw so components can handle it
        }
    };

    return {
        leadId,
        sessionId,
        loading,
        error,
        trackAction,
        debugInfo, // Useful for debugging
    };
}
// src/components/OfferChainContainer.jsx - Updated with debug panel
'use client';

import { useState, useEffect } from 'react';
import OfferCard from './OfferCard';
import ProgressChain from './ProgressChain';
import { apiService, ACTION_TYPES } from '../services/apiService';
import { useUserSession } from '../hooks/useUserSession';

export default function OfferChainContainer() {
    const [offers, setOffers] = useState([]);
    const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
    const [offersLoading, setOffersLoading] = useState(true);
    const [offersError, setOffersError] = useState(null);

    // Use user session hook for lead tracking (now with better debugging)
    const { leadId, sessionId, loading: sessionLoading, error: sessionError, trackAction, debugInfo } = useUserSession();

    // Get current offer
    const currentOffer = offers[currentOfferIndex];
    const currentStep = currentOfferIndex + 1;

    // Fetch offers from API
    useEffect(() => {
        const fetchOffers = async () => {
            try {
                setOffersLoading(true);
                const offersData = await apiService.getOffers();
                setOffers(offersData);
                console.log('📦 Loaded offers:', offersData.length);
                setOffersLoading(false);
            } catch (err) {
                console.error('❌ Error fetching offers:', err);
                setOffersError(err.message);
                setOffersLoading(false);
            }
        };

        fetchOffers();
    }, []);

    // Handle decline action
    const handleDecline = async () => {
        if (!currentOffer) return;

        try {
            await trackAction(ACTION_TYPES.DECLINE, currentOffer.offerId, currentStep);

            // Move to next offer, or loop back to first if at the end
            const nextIndex = (currentOfferIndex + 1) % offers.length;
            setCurrentOfferIndex(nextIndex);
        } catch (err) {
            console.error('❌ Error tracking decline action:', err);
            // Still proceed to next offer even if tracking fails
            const nextIndex = (currentOfferIndex + 1) % offers.length;
            setCurrentOfferIndex(nextIndex);
        }
    };

    // Handle accept action
    const handleAccept = async () => {
        if (!currentOffer) return;

        try {
            await trackAction(ACTION_TYPES.SUBMIT, currentOffer.offerId, currentStep);

            // Redirect to affiliate URL
            console.log('🔗 Redirecting to:', currentOffer.affiliateUrl);

            // In production: window.open(currentOffer.affiliateUrl, '_blank');
            // For demo, show alert and move to next offer
            alert(`Would redirect to: ${currentOffer.affiliateUrl}`);

            // Move to next offer
            const nextIndex = (currentOfferIndex + 1) % offers.length;
            setCurrentOfferIndex(nextIndex);
        } catch (err) {
            console.error('❌ Error tracking accept action:', err);
            // Still proceed to next offer even if tracking fails
            const nextIndex = (currentOfferIndex + 1) % offers.length;
            setCurrentOfferIndex(nextIndex);
        }
    };

    // Track page view when offer changes
    useEffect(() => {
        if (currentOffer && leadId && !sessionLoading && !offersLoading) {
            trackAction(ACTION_TYPES.VIEW, currentOffer.offerId, currentStep)
                .catch(err => console.error('❌ Error tracking view action:', err));
        }
    }, [currentOfferIndex, currentOffer, leadId, sessionLoading, offersLoading]);

    // Loading state
    if (sessionLoading || offersLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        {sessionLoading ? 'Initializing session...' : 'Loading offers...'}
                    </p>
                    {/* Show debug info during loading in development */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-4 text-xs text-gray-500">
                            Session ID: {sessionId ? `${sessionId.slice(0, 8)}...` : 'Generating...'}
                            <br />
                            Lead ID: {leadId ? `${leadId.slice(0, 8)}...` : 'Loading...'}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Error state
    if (sessionError || offersError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="text-red-600 text-xl mb-4">⚠️ Error</div>
                    <p className="text-gray-600 mb-4">{sessionError || offersError}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // No offers state
    if (!offers.length) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-gray-600">No offers available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 w-full relative">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"></div>
            </div>

            {/* Progress Chain */}
            <div className="w-full relative z-10">
                <ProgressChain
                    currentStep={currentStep}
                    totalSteps={offers.length}
                />
            </div>

            {/* Main Offer Content */}
            <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
                <OfferCard
                    offer={{
                        title: currentOffer.title,
                        description: currentOffer.description,
                        savingsText: currentOffer.savingsText,
                    }}
                    onDecline={handleDecline}
                    onAccept={handleAccept}
                />
            </div>

            {/*/!* Debug Panel - only shows in development *!/*/}
            {/*<DebugSessionPanel*/}
            {/*    leadId={leadId}*/}
            {/*    sessionId={sessionId}*/}
            {/*    debugInfo={debugInfo}*/}
            {/*/>*/}
        </div>
    );
}
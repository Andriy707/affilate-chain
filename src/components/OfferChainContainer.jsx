// src/components/OfferChainContainer.jsx
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

    // Use user session hook for lead tracking
    const { leadId, sessionId, loading: sessionLoading, error: sessionError, trackAction } = useUserSession();

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
                console.log('Loaded offers:', offersData.length);
                setOffersLoading(false);
            } catch (err) {
                console.error('Error fetching offers:', err);
                setOffersError(err.message);
                setOffersLoading(false);
            }
        };

        fetchOffers();
    }, []);

    // Handle decline action
    const handleDecline = async () => {
        if (!currentOffer) return;

        await trackAction(ACTION_TYPES.DECLINE, currentOffer.offerId, currentStep);

        // Move to next offer, or loop back to first if at the end
        const nextIndex = (currentOfferIndex + 1) % offers.length;
        setCurrentOfferIndex(nextIndex);
    };

    // Handle accept action
    const handleAccept = async () => {
        if (!currentOffer) return;

        await trackAction(ACTION_TYPES.SUBMIT, currentOffer.offerId, currentStep);

        // Redirect to affiliate URL
        console.log('Redirecting to:', currentOffer.affiliateUrl);

        // In production: window.open(currentOffer.affiliateUrl, '_blank');
        // For demo, show alert and move to next offer
        alert(`Redirecting to: ${currentOffer.affiliateUrl}`);

        // Move to next offer
        const nextIndex = (currentOfferIndex + 1) % offers.length;
        setCurrentOfferIndex(nextIndex);
    };

    // Track page view when offer changes
    useEffect(() => {
        if (currentOffer && leadId && !sessionLoading && !offersLoading) {
            trackAction(ACTION_TYPES.VIEW, currentOffer.offerId, currentStep);
        }
    }, [currentOfferIndex, currentOffer, leadId, sessionLoading, offersLoading]);

    // Loading state
    if (sessionLoading || offersLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        {sessionLoading ? 'Initializing session...' : 'Loading offers...'}
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    if (sessionError || offersError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">No offers available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Progress Chain */}
            <ProgressChain
                currentStep={currentStep}
                totalSteps={offers.length}
            />

            {/* Main Offer Content */}
            <div className="container mx-auto px-4 py-8">
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

            {/* Debug Info (remove in production) */}
            <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg text-xs max-w-xs">
                <div className="font-semibold mb-2">Debug Info:</div>
                <div>Current Step: {currentStep}/{offers.length}</div>
                <div>Offer ID: {currentOffer?.offerId}</div>
                <div>Lead ID: {leadId}</div>
                <div>Session ID: {sessionId}</div>
                <div>Total Offers: {offers.length}</div>
            </div>
        </div>
    );
}
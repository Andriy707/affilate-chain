// src/components/admin/OfferFormModal.jsx
'use client';

import { useState, useEffect } from 'react';

export default function OfferFormModal({ isOpen, onClose, onSave, offer = null }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        savingsText: '',
        affiliateUrl: '',
        position: '',
        isActive: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Populate form when editing an offer
    useEffect(() => {
        if (offer) {
            setFormData({
                title: offer.title || '',
                description: offer.description || '',
                savingsText: offer.savingsText || '',
                affiliateUrl: offer.affiliateUrl || '',
                position: offer.position || '',
                isActive: offer.isActive ?? true,
            });
        } else {
            setFormData({
                title: '',
                description: '',
                savingsText: '',
                affiliateUrl: '',
                position: '',
                isActive: true,
            });
        }
        setError('');
    }, [offer, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const auth = sessionStorage.getItem('adminAuth');
            if (!auth) {
                setError('Authentication required');
                return;
            }

            const url = offer
                ? `/api/admin/offers/${offer.offerId}`
                : '/api/admin/offers';

            const method = offer ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${auth}`,
                },
                body: JSON.stringify({
                    ...formData,
                    position: parseInt(formData.position) || undefined,
                }),
            });

            const data = await response.json();

            if (data.success) {
                onSave(data.data);
                onClose();
            } else {
                setError(data.error || 'Failed to save offer');
            }
        } catch (err) {
            setError('Error saving offer');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            {offer ? 'Edit Offer' : 'Add New Offer'}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <span className="sr-only">Close</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title *
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                placeholder="Enter offer title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description *
                            </label>
                            <textarea
                                required
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="Enter offer description"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Savings Text *
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={formData.savingsText}
                                onChange={(e) => setFormData({...formData, savingsText: e.target.value})}
                                placeholder="e.g., SAVE UP TO $500/YEAR"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Affiliate URL *
                            </label>
                            <input
                                type="url"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={formData.affiliateUrl}
                                onChange={(e) => setFormData({...formData, affiliateUrl: e.target.value})}
                                placeholder="https://example.com/affiliate-link"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Position
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.position}
                                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                                    placeholder="Auto-assigned if empty"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.isActive}
                                    onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : (offer ? 'Update Offer' : 'Create Offer')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
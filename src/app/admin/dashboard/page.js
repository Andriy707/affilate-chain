// src/app/admin/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OfferFormModal from '../../../components/admin/OfferFormModal';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [data, setData] = useState({
        leads: [],
        actions: [],
        offers: [],
        stats: { totalLeads: 0, totalActions: 0, totalOffers: 0 }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState(null);
    const router = useRouter();

    // Check authentication
    useEffect(() => {
        const auth = sessionStorage.getItem('adminAuth');
        if (!auth) {
            router.push('/admin');
            return;
        }

        fetchAllData(auth);
    }, [router]);

    const fetchAllData = async (auth) => {
        try {
            setLoading(true);

            // Fetch offers
            const offersResponse = await fetch('/api/admin/offers', {
                headers: { 'Authorization': `Basic ${auth}` }
            });
            const offersData = await offersResponse.json();

            // Fetch leads (public endpoint)
            const leadsResponse = await fetch('/api/actions');
            const actionsData = await leadsResponse.json();

            if (offersData.success) {
                setData(prev => ({
                    ...prev,
                    offers: offersData.data,
                    actions: actionsData.success ? actionsData.data : [],
                    stats: {
                        totalOffers: offersData.data.length,
                        totalActions: actionsData.success ? actionsData.data.length : 0,
                        totalLeads: new Set(actionsData.success ? actionsData.data.map(a => a.leadId) : []).size
                    }
                }));
            }

            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load dashboard data');
            setLoading(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('adminAuth');
        router.push('/admin');
    };

    const editOffer = (offer) => {
        setEditingOffer(offer);
        setModalOpen(true);
    };

    const handleOfferSave = (savedOffer) => {
        const auth = sessionStorage.getItem('adminAuth');
        fetchAllData(auth); // Refresh all data
    };

    const deleteOffer = async (offerId) => {
        if (!confirm('Are you sure you want to delete this offer?')) return;

        try {
            const auth = sessionStorage.getItem('adminAuth');
            const response = await fetch(`/api/admin/offers/${offerId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Basic ${auth}` }
            });

            if (response.ok) {
                fetchAllData(auth); // Refresh data
            } else {
                alert('Failed to delete offer');
            }
        } catch (err) {
            alert('Error deleting offer');
        }
    };

    const toggleOfferStatus = async (offerId, currentStatus) => {
        try {
            const auth = sessionStorage.getItem('adminAuth');
            const response = await fetch(`/api/admin/offers/${offerId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isActive: !currentStatus })
            });

            if (response.ok) {
                fetchAllData(auth); // Refresh data
            } else {
                alert('Failed to update offer status');
            }
        } catch (err) {
            alert('Error updating offer');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 text-xl mb-4">⚠️ Error</div>
                    <p className="text-gray-600 mb-4">{error}</p>
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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold">A</span>
                                </div>
                                <span className="text-xl font-semibold text-gray-800">Admin Dashboard</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <a href="/" className="text-gray-600 hover:text-gray-900">
                                View Site
                            </a>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        {[
                            { id: 'overview', label: 'Overview' },
                            { id: 'offers', label: 'Offers' },
                            { id: 'actions', label: 'User Actions' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {activeTab === 'overview' && (
                    <div className="px-4 py-6 sm:px-0">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                                <span className="text-white font-bold">L</span>
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Total Leads
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {data.stats.totalLeads}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                                                <span className="text-white font-bold">A</span>
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Total Actions
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {data.stats.totalActions}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                                                <span className="text-white font-bold">O</span>
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Total Offers
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {data.stats.totalOffers}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                {data.actions.slice(0, 10).map((action, index) => (
                                    <div key={action.actionId} className="flex items-center justify-between border-b pb-2">
                                        <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          action.actionType === 'PATH_VIEW' ? 'bg-blue-100 text-blue-800' :
                              action.actionType === 'PATH_DECLINE' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                      }`}>
                        {action.actionType}
                      </span>
                                            <span className="ml-2 text-sm text-gray-600">
                        Lead: {action.leadId.slice(0, 8)}...
                      </span>
                                        </div>
                                        <span className="text-sm text-gray-500">
                      {new Date(action.createdAt).toLocaleString()}
                    </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'offers' && (
                    <div className="px-4 py-6 sm:px-0">
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-900">Manage Offers</h3>
                                <button
                                    onClick={() => {
                                        setEditingOffer(null);
                                        setModalOpen(true);
                                    }}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
                                    Add New Offer
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Position
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions Count
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {data.offers.map((offer) => (
                                        <tr key={offer.offerId}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {offer.position}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                <div className="max-w-xs truncate">{offer.title}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              offer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {offer.isActive ? 'Active' : 'Inactive'}
                          </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {offer._count?.actions || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button
                                                    onClick={() => editOffer(offer)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => toggleOfferStatus(offer.offerId, offer.isActive)}
                                                    className={`${
                                                        offer.isActive ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'
                                                    }`}
                                                >
                                                    {offer.isActive ? 'Deactivate' : 'Activate'}
                                                </button>
                                                <button
                                                    onClick={() => deleteOffer(offer.offerId)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'actions' && (
                    <div className="px-4 py-6 sm:px-0">
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">User Actions Log</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Timestamp
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Lead ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Offer Position
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Offer Title
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {data.actions.slice(0, 50).map((action) => (
                                        <tr key={action.actionId}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(action.createdAt).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              action.actionType === 'PATH_VIEW' ? 'bg-blue-100 text-blue-800' :
                                  action.actionType === 'PATH_DECLINE' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-green-100 text-green-800'
                          }`}>
                            {action.actionType}
                          </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                                {action.leadId.slice(0, 8)}...
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {action.offerPosition || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                <div className="max-w-xs truncate">
                                                    {action.offer?.title || 'N/A'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Offer Form Modal */}
            <OfferFormModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingOffer(null);
                }}
                onSave={handleOfferSave}
                offer={editingOffer}
            />
        </div>
    );
}
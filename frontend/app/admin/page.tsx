"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function AdminDashboard() {
    const router = useRouter();
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPending = async () => {
        try {
            const { data } = await api.get('/listings/admin/pending');
            setListings(data);
        } catch (err: any) {
            setError(err.response?.status === 403 ? 'Access Denied: Admins Only' : 'Failed to fetch pending ads');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        if (!confirm(`Are you sure you want to ${action} this ad?`)) return;

        try {
            await api.post(`/listings/${id}/${action}`);
            // Remove from list
            setListings(listings.filter(l => l.id !== id));
        } catch (err) {
            alert('Action failed');
        }
    };

    if (loading) return <div className="p-20 text-center">Loading Admin Panel...</div>;
    if (error) return <div className="p-20 text-center text-red-600 font-bold">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-slate-800">Admin Dashboard</h1>

            <div className="bg-white rounded-xl shadow border overflow-hidden">
                <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Pending Approvals ({listings.length})</h2>
                    <button onClick={fetchPending} className="text-sm text-primary hover:underline">Refresh</button>
                </div>

                {listings.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">No pending ads to review. Good job!</div>
                ) : (
                    <div className="divide-y">
                        {listings.map((item) => (
                            <div key={item.id} className="p-6 flex flex-col md:flex-row gap-6">
                                {/* Image */}
                                <div className="w-full md:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                    {item.images && item.images.length > 0 ? (
                                        <img src={`http://localhost:3001${item.images[0].url}`} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400 text-xs">No Image</div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                                    <p className="text-primary font-bold mb-1">PKR {item.price.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500 mb-2">
                                        {item.year} | {item.city} | Posted by {item.user?.firstName || 'Unknown'}
                                    </p>
                                    <p className="text-sm text-gray-700 line-clamp-2">{item.description}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 items-center">
                                    <button
                                        onClick={() => handleAction(item.id, 'approve')}
                                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(item.id, 'reject')}
                                        className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

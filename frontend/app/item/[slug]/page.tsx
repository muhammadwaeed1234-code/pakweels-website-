"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ListingDetailPage() {
    const { slug } = useParams();
    const [listing, setListing] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        if (!slug) return;
        const fetchListing = async () => {
            try {
                const { data } = await api.get(`/listings/${slug}`);
                setListing(data);
            } catch (err) {
                setError('Listing not found');
            } finally {
                setLoading(false);
            }
        };
        fetchListing();
    }, [slug]);

    if (loading) return <div className="p-20 text-center">Loading...</div>;
    if (error || !listing) return <div className="p-20 text-center text-red-600">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 mb-4">
                <Link href="/" className="hover:underline">Home</Link> &gt;
                <Link href="/listings" className="hover:underline"> Used Cars</Link> &gt;
                <span className="text-gray-800 font-medium"> {listing.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* Image Gallery */}
                    <div className="bg-gray-200 h-[400px] rounded-xl overflow-hidden mb-6 flex items-center justify-center relative">
                        {listing.images && listing.images.length > 0 ? (
                            <img
                                src={`${API_URL}${listing.images[0].url}`}
                                alt={listing.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-gray-400 font-bold text-xl">No Images Uploaded</div>
                        )}
                    </div>

                    {/* Basic Info */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">{listing.title}</h1>
                        <p className="text-gray-500 text-lg mb-4">{listing.city} &bull; Posted on {new Date(listing.createdAt).toLocaleDateString()}</p>

                        <div className="grid grid-cols-4 gap-4 text-center border-t border-b py-6">
                            <div>
                                <div className="text-gray-500 text-sm">Year</div>
                                <div className="font-bold text-lg">{listing.year}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 text-sm">Mileage</div>
                                <div className="font-bold text-lg">{listing.mileage.toLocaleString()} km</div>
                            </div>
                            <div>
                                <div className="text-gray-500 text-sm">Fuel</div>
                                <div className="font-bold text-lg">{listing.fuel}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 text-sm">Trans.</div>
                                <div className="font-bold text-lg">{listing.transmission}</div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <h2 className="text-xl font-bold mb-4">Seller's Description</h2>
                        <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                            {listing.description || 'No description provided.'}
                        </p>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    {/* Price Card */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border sticky top-24">
                        <div className="text-gray-500 text-sm mb-1">Price</div>
                        <div className="text-3xl font-bold text-primary mb-6">PKR {listing.price.toLocaleString()}</div>

                        <button className="w-full bg-primary text-white font-bold py-3 rounded-lg mb-3 hover:bg-red-700 transition">
                            Show Phone Number
                        </button>
                        <button
                            onClick={async () => {
                                const token = localStorage.getItem('token');
                                if (!token) {
                                    window.location.href = `/auth/login?redirect=/item/${slug}`;
                                    return;
                                }
                                try {
                                    const { data } = await api.post('/chat/conversations', {
                                        sellerId: listing.userId,
                                        listingId: listing.id
                                    });
                                    window.location.href = `/chat`;
                                } catch (err) {
                                    alert('Failed to start chat');
                                }
                            }}
                            className="w-full border border-primary text-primary font-bold py-3 rounded-lg hover:bg-red-50 transition"
                        >
                            Chat with Seller
                        </button>

                        <div className="mt-6 pt-6 border-t">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                                    {listing.user?.firstName?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <div className="font-bold">{listing.user?.firstName || 'Seller'}</div>
                                    <div className="text-sm text-gray-500">Member since {new Date(listing.user?.createdAt || Date.now()).getFullYear()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <RelatedListings listingId={listing.id} />
        </div>
    );
}

import RelatedListings from '@/components/RelatedListings';

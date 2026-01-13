"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SearchSidebar from '@/components/SearchSidebar';

interface Listing {
    id: string;
    title: string;
    price: number;
    city: string;
    year: number;
    mileage: number;
    slug: string;
    images: { url: string }[];
}

export default function ListingsPage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            try {
                const query = searchParams.toString();
                const { data } = await api.get(`/listings?${query}`);
                setListings(data);
            } catch (err) {
                console.error('Failed to fetch listings', err);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, [searchParams]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Used Cars for Sale</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <SearchSidebar />
                </div>

                {/* Results */}
                <div className="lg:col-span-3">
                    {loading ? (
                        <div className="text-center py-20">Updating results...</div>
                    ) : listings.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-lg border">
                            <p className="text-xl text-gray-500 mb-4">No cars match your search.</p>
                            <Link href="/listings/create" className="text-primary font-bold hover:underline">Post an ad</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {listings.map((car) => (
                                <div key={car.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition group">
                                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                                        {car.images && car.images.length > 0 ? (
                                            <img
                                                src={`${API_URL}${car.images[0].url}`}
                                                alt={car.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <Link href={`/item/${car.slug}`} className="block">
                                            <h3 className="font-semibold text-lg mb-1 group-hover:text-primary truncate">{car.title}</h3>
                                        </Link>
                                        <p className="text-secondary font-bold text-xl mb-2">PKR {car.price.toLocaleString()}</p>
                                        <div className="text-sm text-gray-500 flex justify-between">
                                            <span>{car.city}</span>
                                            <span>{car.year} | {car.mileage} km</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

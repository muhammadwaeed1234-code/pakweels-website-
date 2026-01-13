"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function RelatedListings({ listingId }: { listingId: string }) {
    const [listings, setListings] = useState<any[]>([]);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                const { data } = await api.get(`/listings/${listingId}/recommendations`);
                setListings(data);
            } catch (e) { console.error(e); }
        };
        fetchRelated();
    }, [listingId]);

    if (listings.length === 0) return null;

    return (
        <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 text-slate-800">You May Also Like</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {listings.map(car => (
                    <div key={car.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition group">
                        <div className="h-40 bg-gray-200 relative overflow-hidden">
                            {car.images && car.images.length > 0 ? (
                                <img src={`http://localhost:3001${car.images[0].url}`} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                            )}
                        </div>
                        <div className="p-4">
                            <Link href={`/item/${car.slug}`} className="block">
                                <h4 className="font-bold truncate group-hover:text-primary">{car.title}</h4>
                            </Link>
                            <p className="text-secondary font-bold">PKR {car.price.toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

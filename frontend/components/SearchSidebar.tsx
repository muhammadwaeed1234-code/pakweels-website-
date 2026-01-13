"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SearchSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState({
        city: searchParams.get('city') || '',
        make: searchParams.get('make') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        minYear: searchParams.get('minYear') || '',
        maxYear: searchParams.get('maxYear') || '',
    });

    const handleChange = (e: any) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        router.push(`/listings?${params.toString()}`);
    };

    return (
        <div className="bg-white p-4 rounded-xl border shadow-sm">
            <h3 className="font-bold text-lg mb-4">Filters</h3>

            <div className="space-y-4">
                <div>
                    <label className="text-sm text-gray-600 block mb-1">City</label>
                    <select name="city" className="w-full border rounded p-2 text-sm" onChange={handleChange} value={filters.city}>
                        <option value="">All Cities</option>
                        <option value="Lahore">Lahore</option>
                        <option value="Karachi">Karachi</option>
                        <option value="Islamabad">Islamabad</option>
                    </select>
                </div>

                <div>
                    <label className="text-sm text-gray-600 block mb-1">Make</label>
                    <input
                        name="make"
                        placeholder="e.g. Honda"
                        className="w-full border rounded p-2 text-sm"
                        onChange={handleChange}
                        value={filters.make}
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600 block mb-1">Price Range</label>
                    <div className="flex gap-2">
                        <input name="minPrice" type="number" placeholder="Min" className="w-full border rounded p-2 text-sm" onChange={handleChange} value={filters.minPrice} />
                        <input name="maxPrice" type="number" placeholder="Max" className="w-full border rounded p-2 text-sm" onChange={handleChange} value={filters.maxPrice} />
                    </div>
                </div>

                <div>
                    <label className="text-sm text-gray-600 block mb-1">Year</label>
                    <div className="flex gap-2">
                        <input name="minYear" type="number" placeholder="From" className="w-full border rounded p-2 text-sm" onChange={handleChange} value={filters.minYear} />
                        <input name="maxYear" type="number" placeholder="To" className="w-full border rounded p-2 text-sm" onChange={handleChange} value={filters.maxYear} />
                    </div>
                </div>

                <button
                    onClick={applyFilters}
                    className="w-full bg-primary text-white font-bold py-2 rounded hover:bg-red-700 transition"
                >
                    Search
                </button>
            </div>
        </div>
    );
}

"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="bg-secondary text-white py-20 px-4">
                <div className="container mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-6">Find Your Dream Car</h1>
                    <p className="text-xl mb-8 text-gray-300">Pakistan's most trusted vehicle marketplace.</p>

                    <div className="bg-white p-4 rounded-lg shadow-lg max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Search by Make, Model or Keyword"
                            className="flex-1 p-3 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button className="bg-primary hover:bg-red-800 text-white px-8 py-3 rounded font-bold transition">
                            Search
                        </button>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">Browse by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {['Sedan', 'SUV', 'Hatchback', 'Commercial'].map((cat) => (
                            <div key={cat} className="p-6 border rounded-xl hover:shadow-lg hover:border-primary cursor-pointer transition text-center">
                                <h3 className="font-semibold text-lg">{cat}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Ads Placeholder */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-8 text-slate-800">Featured Vehicles</h2>
                    <div className="text-gray-500">Loading premium listings...</div>
                </div>
            </section>
        </div>
    );
}

"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function CreateListingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    // Protect Route
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login?redirect=/listings/create');
        }
    }, [router]);

    const [form, setForm] = useState({
        title: '',
        price: '',
        year: '',
        mileage: '',
        city: '',
        make: '',
        model: '',
        engineCapacity: '',
        transmission: 'AUTOMATIC',
        fuel: 'PETROL',
        description: ''
    });

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Create Listing
            const payload = {
                ...form,
                price: Number(form.price),
                year: Number(form.year),
                mileage: Number(form.mileage),
            };

            const { data: listing } = await api.post('/listings', payload);

            // 2. Upload Image if selected
            if (selectedFile) {
                setUploading(true);
                const formData = new FormData();
                formData.append('file', selectedFile);
                await api.post(`/uploads/${listing.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            router.push('/listings');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to post ad');
            console.error(err);
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-slate-800">Sell Your Car</h1>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="col-span-2">
                        <label className="label">Ad Title</label>
                        <input
                            name="title" required
                            placeholder="e.g. Toyota Corolla Grande 2022"
                            className="input-field"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="label">Price (PKR)</label>
                        <input type="number" name="price" required className="input-field" onChange={handleChange} />
                    </div>

                    <div>
                        <label className="label">City</label>
                        <select name="city" required className="input-field" onChange={handleChange}>
                            <option value="">Select City</option>
                            <option value="Lahore">Lahore</option>
                            <option value="Karachi">Karachi</option>
                            <option value="Islamabad">Islamabad</option>
                        </select>
                    </div>

                    <div>
                        <label className="label">Make</label>
                        <input name="make" required placeholder="e.g. Honda" className="input-field" onChange={handleChange} />
                    </div>

                    <div>
                        <label className="label">Model</label>
                        <input name="model" required placeholder="e.g. Civic" className="input-field" onChange={handleChange} />
                    </div>

                    <div>
                        <label className="label">Year</label>
                        <input type="number" name="year" required min="1990" max="2026" className="input-field" onChange={handleChange} />
                    </div>

                    <div>
                        <label className="label">Mileage (km)</label>
                        <input type="number" name="mileage" required className="input-field" onChange={handleChange} />
                    </div>

                    <div>
                        <label className="label">Engine (cc)</label>
                        <input name="engineCapacity" required placeholder="e.g. 1800cc" className="input-field" onChange={handleChange} />
                    </div>

                    <div>
                        <label className="label">Transmission</label>
                        <select name="transmission" className="input-field" onChange={handleChange}>
                            <option value="AUTOMATIC">Automatic</option>
                            <option value="MANUAL">Manual</option>
                        </select>
                    </div>

                    <div>
                        <label className="label">Fuel Type</label>
                        <select name="fuel" className="input-field" onChange={handleChange}>
                            <option value="PETROL">Petrol</option>
                            <option value="DIESEL">Diesel</option>
                            <option value="HYBRID">Hybrid</option>
                            <option value="ELECTRIC">Electric</option>
                        </select>
                    </div>

                    <div className="col-span-2">
                        <label className="label">Upload Photo (Cover)</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full p-2 border rounded"
                            onChange={(e) => {
                                if (e.target.files) setSelectedFile(e.target.files[0]);
                            }}
                        />
                        <p className="text-xs text-gray-500 mt-1">Single image upload supported for MVP.</p>
                    </div>

                    <div className="col-span-2">
                        <label className="label">Description</label>
                        <textarea name="description" rows={4} className="input-field" onChange={handleChange}></textarea>
                    </div>

                    <div className="col-span-2 mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-3 rounded-lg font-bold text-lg hover:bg-red-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : (uploading ? 'Uploading Image...' : 'Post Ad Now')}
                        </button>
                    </div>

                </form>

                <style jsx>{`
          .label { @apply block text-sm font-medium text-gray-700 mb-1; }
          .input-field { @apply w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition; }
        `}</style>
            </div>
        </div>
    );
}

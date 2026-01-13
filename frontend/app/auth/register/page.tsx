"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ firstName: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/register', form);
            // Auto login logic is handled in backend auth service? No, usually register just returns token
            // Let's assume register returns same as login
            // Wait, backend auth controller register calls authService.register which calls login. So yes.
            router.push('/auth/login?registered=true');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Create Account</h2>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                            value={form.firstName}
                            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-red-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? <Link href="/auth/login" className="text-primary hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}

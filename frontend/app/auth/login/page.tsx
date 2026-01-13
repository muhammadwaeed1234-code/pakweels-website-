"use client";
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });

            // Save Token and User Data
            localStorage.setItem('token', response.data.access_token);

            // We need user details (role) for the Navbar. 
            // Ideally the login response should return the user object. 
            // For now, let's assume the backend also returns user info or we decode the token.
            // If backend only returns token, we might need a /me endpoint or update login response.
            // Let's blindly trust the response has user for now or fetch it.
            // Actually, checking AuthService, it returns { access_token }. 
            // Quick fix: I'll stick the user in the login response in the backend next.

            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            window.location.href = redirect; // Force refresh to update Navbar
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Login to PakWheels Pro</h1>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account? <Link href="/auth/register" className="text-primary font-bold">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

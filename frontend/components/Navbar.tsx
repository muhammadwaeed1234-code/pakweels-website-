"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        setIsLoggedIn(!!token);
        if (userStr) {
            // Safe parse
            try {
                setUser(JSON.parse(userStr));
            } catch (e) { console.error('Error parsing user', e) }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
        window.location.href = '/';
    };

    return (
        <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold italic tracking-tighter">
                    <span className="text-primary">Pak</span>Wheels<span className="text-xs font-normal opacity-70 ml-1">PRO</span>
                </Link>

                {/* Links */}
                <div className="hidden md:flex gap-6 items-center font-medium">
                    <Link href="/listings" className="hover:text-primary transition">Buy Used Cars</Link>
                    <Link href="#" className="hover:text-primary transition">New Cars</Link>
                    <Link href="#" className="hover:text-primary transition">Bikes</Link>
                    {user && user.role === 'ADMIN' && (
                        <Link href="/admin" className="text-yellow-400 hover:text-yellow-300 transition">Admin Panel</Link>
                    )}
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
                    <Link href="/listings/create" className="bg-primary hover:bg-red-700 text-white px-5 py-2 rounded-full font-bold transition">
                        Post an Ad
                    </Link>

                    <div className="h-6 w-px bg-gray-700 mx-1"></div>

                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="hover:text-gray-300">
                            Logout
                        </button>
                    ) : (
                        <div className="flex gap-4">
                            <Link href="/auth/login" className="hover:text-gray-300">Login</Link>
                            <Link href="/auth/register" className="hover:text-gray-300">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

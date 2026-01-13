import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata: Metadata = {
    title: "AutoMarket Pro | Buy & Sell Cars in Pakistan",
    description: "The most advanced automobile marketplace in Pakistan.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <main className="min-h-screen bg-gray-50">
                    {/* Header will go here */}
                    {children}
                    {/* Footer will go here */}
                </main>
            </body>
        </html>
    );
}

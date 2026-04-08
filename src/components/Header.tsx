"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import {
    ChevronDownIcon,
    ArrowRightOnRectangleIcon,
    QuestionMarkCircleIcon,
    Cog8ToothIcon,
    RectangleStackIcon,
    HomeIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { getWalletAuth } from "@/lib/walletAuth";

const isWalletMode = process.env.NEXT_PUBLIC_AUTH_MODE === "walletconnect";

export default function Header() {
    const { data: session, status } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Wallet mode: track auth state from localStorage
    const [walletAuthenticated, setWalletAuthenticated] = useState(false);
    useEffect(() => {
        if (isWalletMode) {
            setWalletAuthenticated(!!getWalletAuth()?.token);
        }
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const userInitial = session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "?";
    const showMyApps = isWalletMode ? walletAuthenticated : !!session;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#06060c]/80 backdrop-blur-md border-b border-white/5">
            <div className="w-full px-6 h-16 flex items-center justify-between">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
                        O
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">
                        Open <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Prediction Platform</span>
                    </h1>
                </Link>

                {/* Profile / Auth Section */}
                <div className="flex items-center gap-3">
                    {/* My Apps Link - Only show when authenticated */}
                    {showMyApps && (
                        <>
                            <Link
                                href="/"
                                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                            >
                                <HomeIcon className="w-4 h-4" />
                                Home
                            </Link>
                            <Link
                                href="/my-apps"
                                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                            >
                                <RectangleStackIcon className="w-4 h-4" />
                                My Apps
                            </Link>
                        </>
                    )}

                    {/* ── WalletConnect auth slot ── */}
                    {isWalletMode && <WalletConnectSlot />}

                    {/* ── Google auth slot ── */}
                    {!isWalletMode && (
                        <>
                            {status === "loading" ? (
                                <div className="w-20 h-8 bg-white/5 animate-pulse rounded-lg" />
                            ) : session ? (
                                <div className="relative" ref={menuRef}>
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-white/5 transition-all text-left group"
                                    >
                                        {/* Avatar */}
                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 flex items-center justify-center bg-indigo-600 group-hover:border-white/20 transition-all">
                                            {session.user?.image ? (
                                                <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-white font-bold">{userInitial}</span>
                                            )}
                                        </div>

                                        {/* Name/Email Stack */}
                                        <div className="hidden sm:flex flex-col">
                                            <span className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                                                {session.user?.name}
                                            </span>
                                            <span className="text-[10px] text-gray-500 truncate max-w-[150px]">
                                                {session.user?.email}
                                            </span>
                                        </div>
                                        <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-[#111218] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                            <div className="px-4 py-3 border-b border-white/5 sm:hidden">
                                                <p className="text-sm font-bold text-white truncate">{session.user?.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                                            </div>

                                            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                                                <Cog8ToothIcon className="w-4 h-4" />
                                                Settings
                                            </button>
                                            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                                                <QuestionMarkCircleIcon className="w-4 h-4" />
                                                Help
                                            </button>
                                            <div className="h-px bg-white/5 my-1" />
                                            <button
                                                onClick={() => signOut()}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-colors font-medium"
                                            >
                                                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => signIn("google")}
                                    className="px-4 py-2 rounded-lg bg-white text-black text-sm font-bold hover:bg-gray-200 transition-all flex items-center gap-2 active:scale-95"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

/**
 * Lazy slot for WalletConnectButton — isolated in its own component
 * so that if wagmi hooks throw during SSR they don't crash the whole header.
 */
function WalletConnectSlot() {
    // Dynamic import at runtime to avoid SSR issues with wagmi hooks
    const [WCButton, setWCButton] = useState<React.ComponentType | null>(null);
    useEffect(() => {
        import("@/components/WalletConnectButton").then((m) => {
            setWCButton(() => m.default);
        });
    }, []);

    if (!WCButton) {
        return <div className="h-9 w-28 bg-white/5 animate-pulse rounded-lg" />;
    }
    return <WCButton />;
}

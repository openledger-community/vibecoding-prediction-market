"use client";

import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const isWalletMode = process.env.NEXT_PUBLIC_AUTH_MODE === "walletconnect";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [WCButton, setWCButton] = useState<React.ComponentType | null>(null);

    // Dynamically load WalletConnectButton in wallet mode to avoid SSR issues
    useEffect(() => {
        if (isWalletMode && isOpen) {
            import("@/components/WalletConnectButton").then((m) => {
                setWCButton(() => m.default);
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-[#0f1016] border border-white/10 rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
                    aria-label="Close"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>

                <div className="text-center">
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
                        <span className="text-3xl">{isWalletMode ? "🔗" : "🔐"}</span>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        {isWalletMode
                            ? "Connect your wallet to search and interact with prediction markets."
                            : "You need to sign in to search and interact with prediction markets."}
                    </p>

                    {/* WalletConnect button */}
                    {isWalletMode && (
                        <div className="flex justify-center">
                            {WCButton ? (
                                <WCButton />
                            ) : (
                                <div className="h-12 w-40 bg-white/5 animate-pulse rounded-xl" />
                            )}
                        </div>
                    )}

                    {/* Google button */}
                    {!isWalletMode && (
                        <button
                            onClick={() => signIn("google")}
                            className="w-full py-4 px-6 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>
                    )}

                    <p className="mt-6 text-xs text-gray-500">
                        By continuing, you agree to our Terms and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
}

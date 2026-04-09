"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitState,
  useAppKitNetwork,
  useDisconnect,
} from "@reown/appkit/react";
import { useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { setWalletAuth, clearWalletAuth } from "@/lib/walletAuth";
import { IoWallet } from "react-icons/io5";

// Module-level flag: prevents duplicate SIWE calls under React Strict Mode
let _loginInFlight = false;
let _loginTimeoutId: ReturnType<typeof setTimeout> | null = null;

export default function WalletConnectButton() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const { initialized } = useAppKitState();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const [mounted, setMounted] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Restore persisted auth state on mount
    const stored = typeof window !== "undefined"
      ? localStorage.getItem("vibe_wallet_auth")
      : null;
    if (stored) setIsAuthenticated(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // SIWE login flow
  const handleLogin = async () => {
    if (!address) return;
    if (_loginInFlight) return;
    _loginInFlight = true;

    try {
      setIsAuthenticating(true);

      // 0. Switch to target chain (Ethereum Mainnet for prod) if wallet is on wrong chain
      let chainToUse = Number(chainId);
      const siweChainId = 1; // Ethereum Mainnet
      if (chainToUse !== siweChainId && typeof window !== 'undefined' && (window as any).ethereum) {
        const targetHex = '0x' + siweChainId.toString(16);
        try {
          await (window as any).ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetHex }],
          });
          chainToUse = siweChainId;
        } catch (switchErr: any) {
          if (switchErr?.code === 4902) {
            await (window as any).ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: targetHex,
                chainName: 'Ethereum Mainnet',
                nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://cloudflare-eth.com'],
                blockExplorerUrls: ['https://etherscan.io'],
              }],
            });
            await (window as any).ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: targetHex }],
            });
            chainToUse = siweChainId;
          } else {
            throw switchErr;
          }
        }
      }

      // 1. Get nonce
      const nonceRes = await fetch("/api/wallet/nonce");
      if (!nonceRes.ok) throw new Error("Failed to get nonce");
      const nonceData = await nonceRes.json();
      const nonce = nonceData?.data?.nonce || nonceData?.nonce;
      if (!nonce) throw new Error("Invalid nonce response");

      // 2. Create SIWE Message (use chain we switched to, not original)
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: chainToUse,
        nonce,
      });

      const messageToSign = message.prepareMessage();

      // 3. Sign Message
      const signature = await signMessageAsync({
        message: messageToSign,
      });

      // 4. Verify & Login
      const loginPayload = {
        message,
        signature,
        public_key: address,
      };

      const loginRes = await fetch("/api/wallet/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginPayload),
      });
      if (!loginRes.ok) throw new Error("Login failed");
      const loginData = await loginRes.json();
      const token = loginData?.token;
      if (!token) throw new Error("No token returned");

      // 5. Store auth data and update state
      setWalletAuth({ token, address });
      setIsAuthenticated(true);
      // Reload so server components / API guards pick up the new auth headers
      window.location.reload();
    } catch (error) {
      console.error("[WalletConnect] Login error:", error);
      _loginInFlight = false;
      await disconnect();
    } finally {
      _loginInFlight = false;
      setIsAuthenticating(false);
    }
  };

  // Reset in-flight guard when disconnected
  useEffect(() => {
    if (!isConnected) {
      _loginInFlight = false;
      if (_loginTimeoutId) {
        clearTimeout(_loginTimeoutId);
        _loginTimeoutId = null;
      }
    }
  }, [isConnected]);

  // Auto-login: wallet connected but no auth token yet
  useEffect(() => {
    if (!isConnected || !initialized || isAuthenticated || isAuthenticating || !address) return;

    const doLogin = () => {
      if (_loginInFlight) return;
      handleLogin();
    };
    _loginTimeoutId = setTimeout(doLogin, 150);
    return () => {
      if (_loginTimeoutId) {
        clearTimeout(_loginTimeoutId);
        _loginTimeoutId = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, initialized, isAuthenticated, address]);

  // Logout when wallet disconnects
  useEffect(() => {
    if (initialized && !isConnected && isAuthenticated) {
      clearWalletAuth();
      setIsAuthenticated(false);
      window.location.reload();
    }
  }, [isConnected, initialized, isAuthenticated]);

  const showSkeleton =
    !mounted || !initialized || (isConnected && !isAuthenticated);
  const showConnected = isConnected && isAuthenticated;

  return (
    <div className="flex items-center">
      {showSkeleton && (
        <div className="h-9 w-28 bg-white/5 animate-pulse rounded-lg" />
      )}

      {!showSkeleton && showConnected && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-white/5 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/10 border border-blue-500/20 group-hover:border-blue-400/40 transition-all shadow-inner">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                {address?.slice(0, 6)}…{address?.slice(-4)}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Verified</span>
            </div>
            <svg
              className={`w-3.5 h-3.5 text-slate-600 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-60 bg-[#0d0f16] border border-white/5 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 backdrop-blur-xl">
              {/* Address section */}
              <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600 mb-2">
                  Wallet Address
                </p>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold text-slate-200 truncate tracking-tight">
                    {address}
                  </p>
                  <button
                    onClick={async () => {
                      if (address) {
                        await navigator.clipboard.writeText(address);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all border border-transparent hover:border-blue-500/20"
                    title="Copy address"
                  >
                    {copied ? (
                      <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="p-2">
                <button
                  onClick={() => { open(); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-400 hover:bg-blue-500/10 hover:text-blue-400 transition-all rounded-xl border border-transparent hover:border-blue-500/20 uppercase tracking-widest"
                >
                  <IoWallet className="w-4 h-4" />
                  Manage Wallet
                </button>
                <div className="h-px bg-white/5 my-2 mx-2" />
                <button
                  onClick={() => disconnect()}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-all rounded-xl border border-transparent hover:border-rose-500/20 uppercase tracking-widest"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!showSkeleton && !showConnected && (
        <button
          onClick={() => open()}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[11px] font-bold uppercase tracking-widest hover:from-blue-500 hover:to-blue-400 transition-all flex items-center gap-2.5 active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.25)] border border-blue-400/20"
        >
          <IoWallet className="w-4 h-4" />
          Connect Wallet
        </button>
      )}
    </div>
  );
}

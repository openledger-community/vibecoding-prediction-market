/**
 * Client-side wallet auth token storage (localStorage).
 * Used in walletconnect mode instead of next-auth sessions.
 */

const WALLET_AUTH_KEY = "vibe_wallet_auth";

export interface WalletAuthData {
  token: string;
  address: string;
}

export function setWalletAuth(data: WalletAuthData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(WALLET_AUTH_KEY, JSON.stringify(data));
}

export function getWalletAuth(): WalletAuthData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(WALLET_AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as WalletAuthData;
  } catch {
    return null;
  }
}

export function clearWalletAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(WALLET_AUTH_KEY);
}

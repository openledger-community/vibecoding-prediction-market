/**
 * fetchWithAuth — drop-in replacement for `fetch()` that automatically
 * attaches wallet auth headers (x-wallet-address + Authorization) in
 * walletconnect mode, or passes through unchanged in google mode.
 *
 * Usage: just replace `fetch(url, opts)` with `fetchWithAuth(url, opts)`
 * on any call that hits an auth-guarded API route.
 */

const isWalletMode = process.env.NEXT_PUBLIC_AUTH_MODE === "walletconnect";

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  if (!isWalletMode) {
    return fetch(url, options);
  }

  // Dynamically read walletAuth to avoid SSR issues
  let token: string | null = null;
  let address: string | null = null;

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("vibe_wallet_auth");
      if (raw) {
        const parsed = JSON.parse(raw);
        token = parsed.token || null;
        address = parsed.address || null;
      }
    } catch {
      // ignore
    }
  }

  const existingHeaders = new Headers(options.headers as HeadersInit | undefined);
  if (token) existingHeaders.set("Authorization", token);
  if (address) existingHeaders.set("x-wallet-address", address);

  return fetch(url, {
    ...options,
    headers: existingHeaders,
  });
}

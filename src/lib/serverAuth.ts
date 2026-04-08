/**
 * Server-side dual-mode auth helper.
 *
 * Google mode  → reads next-auth session (email as wallet identifier)
 * Walletconnect mode → reads x-wallet-address + Authorization headers
 */

import { auth } from "@/auth";

export interface ServerAuthResult {
  wallet: string; // email (google) | 0x address (walletconnect)
  token: string | null; // bearer token for backend (walletconnect) | null (google)
  authenticated: boolean;
}

const isWalletMode =
  process.env.NEXT_PUBLIC_AUTH_MODE === "walletconnect";

export async function getServerAuth(
  request: Request
): Promise<ServerAuthResult> {
  if (isWalletMode) {
    const walletAddress = request.headers.get("x-wallet-address");
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "") || null;

    if (!walletAddress || !token) {
      return { wallet: "", token: null, authenticated: false };
    }
    return { wallet: walletAddress, token, authenticated: true };
  }

  // Google / next-auth mode
  const session = await auth();
  if (!session?.user?.email) {
    return { wallet: "", token: null, authenticated: false };
  }
  return {
    wallet: session.user.email,
    token: null,
    authenticated: true,
  };
}

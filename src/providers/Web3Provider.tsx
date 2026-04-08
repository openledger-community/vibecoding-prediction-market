"use client";

import { wagmiAdapter, projectId, networks } from "@/config/walletconfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import React from "react";
import { WagmiProvider, cookieToInitialState } from "wagmi";

const queryClient = new QueryClient();

const metadata = {
  name: "Open Prediction Platform",
  description: "Search and interact with prediction markets with natural language",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  icons: ["/favicon.ico"],
};

// Created once at module level — safe because this module is only imported when NEXT_PUBLIC_AUTH_MODE=walletconnect
const appKit = createAppKit({
  adapters: [wagmiAdapter],
  projectId: projectId || "placeholder-id",
  networks,
  defaultNetwork: networks[0],
  metadata,
  features: {
    analytics: false,
    email: false,
    socials: [],
  },
  themeMode: "dark",
  themeVariables: {
    "--apkt-accent": "#818cf8",
    "--apkt-color-mix": "#1e1b4b",
    "--apkt-color-mix-strength": 40,
  },
});

interface Web3ProviderProps {
  children: React.ReactNode;
  cookies?: string | null;
}

export default function Web3Provider({ children, cookies }: Web3ProviderProps) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

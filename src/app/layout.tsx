import type { Metadata } from "next";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Open Prediction Platform",
  description: "Search and interact with prediction markets with natural language",
};

const isWalletMode = process.env.NEXT_PUBLIC_AUTH_MODE === "walletconnect";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (isWalletMode) {
    // Dynamically import Web3Provider only when walletconnect mode is active
    // to avoid bundling wagmi/reown in google mode builds
    const Web3Provider = require("@/providers/Web3Provider").default;
    return (
      <html lang="en">
        <body className="min-h-screen bg-gray-950 text-gray-100">
          <SessionWrapper>
            <Web3Provider>
              <Header />
              {children}
            </Web3Provider>
          </SessionWrapper>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-gray-100">
        <SessionWrapper>
          <Header />
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}

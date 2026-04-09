import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import Header from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Vibcoding Prep-dex",
  description: "Search and interact with prediction markets with natural language",
};

const isWalletMode = process.env.NEXT_PUBLIC_AUTH_MODE === "walletconnect";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const fontClassName = `${inter.variable} font-sans`;

  if (isWalletMode) {
    // Dynamically import Web3Provider only when walletconnect mode is active
    // to avoid bundling wagmi/reown in google mode builds
    const Web3Provider = require("@/providers/Web3Provider").default;
    return (
      <html lang="en">
        <body className={`min-h-screen bg-[#06070a] text-slate-100 ${fontClassName}`}>
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
      <body className={`min-h-screen bg-[#06070a] text-slate-100 ${fontClassName}`}>
        <SessionWrapper>
          <Header />
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}

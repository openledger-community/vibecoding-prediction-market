"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { ArrowPathIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import VibeResult from "@/components/VibeResult";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getWalletAuth } from "@/lib/walletAuth";

const isWalletMode = process.env.NEXT_PUBLIC_AUTH_MODE === "walletconnect";

interface App {
  uuid: string;
  name: string;
  description: string;
  chat_id: string | null;
}

export default function AppDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const appId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data for VibeResult
  const [app, setApp] = useState<App | null>(null);
  const [chatData, setChatData] = useState<any | null>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch App Details to get chat_id
        const res = await fetchWithAuth("/api/applications");
        if (!res.ok) throw new Error("Failed to fetch applications");

        const data = await res.json();
        const foundApp = data.apps?.find((a: App) => a.uuid === appId);

        if (!foundApp) {
          setError("App not found");
          setLoading(false);
          return;
        }

        setApp(foundApp);

        // 2. Fetch Chat History if chat_id exists
        if (foundApp.chat_id) {
          try {
            const chatRes = await fetchWithAuth(`/api/chat/${foundApp.chat_id}/history`);
            if (chatRes.ok) {
              const chatHistory = await chatRes.json();
              setChatData(chatHistory.data);
            } else {
              console.warn("Failed to fetch chat history");
            }
          } catch (err) {
            console.error("Error fetching chat history:", err);
          }
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (isWalletMode) {
      const walletData = getWalletAuth();
      if (!walletData?.token) {
        router.push("/");
        return;
      }
      init();
    } else {
      if (status === "loading") return;
      if (!session) {
        router.push("/");
        return;
      }
      init();
    }
  }, [session, status, router, appId]);

  const isLoadingUI = isWalletMode ? loading : (status === "loading" || loading);
  if (isLoadingUI) {
    return (
      <div className="min-h-screen bg-[#06070a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <ArrowPathIcon className="w-10 h-10 text-blue-500 animate-spin" />
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
          </div>
          <p className="text-slate-400 font-bold tracking-widest uppercase text-[10px] animate-pulse">Initializing Interface...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#06070a] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="bg-rose-900/20 border border-rose-900/50 text-rose-400 rounded-3xl p-8 mb-8 shadow-2xl backdrop-blur-xl">
            <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">Access Denied</h2>
            <p className="text-slate-400 font-medium leading-relaxed">{error}</p>
          </div>
          <button
            onClick={() => router.push("/my-apps")}
            className="flex items-center gap-2 text-slate-500 hover:text-white mx-auto transition-all font-bold px-6 py-3 rounded-xl hover:bg-white/5 active:scale-95"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to My Apps
          </button>
        </div>
      </div>
    );
  }

  // Direct Preview - Full Screen VibeResult
  // We use VibeResult which already has a fixed inset-0 layout
  return (
    <div className="min-h-screen bg-[#06070a]">
      <VibeResult
        chat={chatData}
        loading={false} // Loading handled by parent state
        error={null}
        initialPrompt={app?.description}
        initialDescription={app?.description}
        onClose={() => router.push("/my-apps")}
        userEmail={session?.user?.email || undefined}
      />
    </div>
  );
}

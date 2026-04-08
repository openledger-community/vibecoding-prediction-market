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
      <div className="min-h-screen bg-[#06060c] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <ArrowPathIcon className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-gray-400">Loading application...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#06060c] flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-900/20 border border-red-900/50 text-red-400 rounded-lg p-6 mb-6 inline-block">
            <p className="text-lg font-medium">{error}</p>
          </div>
          <br />
          <button
            onClick={() => router.push("/my-apps")}
            className="flex items-center gap-2 text-gray-400 hover:text-white mx-auto transition-colors"
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
    <div className="min-h-screen bg-[#06060c]">
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

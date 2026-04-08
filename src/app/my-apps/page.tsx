"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  TableCellsIcon,
  Squares2X2Icon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getWalletAuth } from "@/lib/walletAuth";

const isWalletMode = process.env.NEXT_PUBLIC_AUTH_MODE === "walletconnect";

interface App {
  uuid: string;
  name: string;
  description: string;
  status: string;
  vercel_project_id?: string;
  created_at?: string;
  updated_at?: string;
}

export default function MyAppsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "tile">("table");

  useEffect(() => {
    if (isWalletMode) {
      const walletData = getWalletAuth();
      if (!walletData?.token) {
        router.push("/");
        return;
      }
      fetchApps();
    } else {
      if (status === "loading") return;
      if (!session) {
        router.push("/");
        return;
      }
      fetchApps();
    }
  }, [session, status, router]);

  const fetchApps = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth("/api/applications");
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to fetch apps" }));
        setError(err.error || "Failed to fetch apps");
        return;
      }
      const data = await res.json();
      console.log("data", data);
      setApps(data.apps || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  const isLoadingUI = isWalletMode ? loading : (status === "loading" || loading);
  if (isLoadingUI) {
    return (
      <div className="min-h-screen bg-[#06060c] pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center gap-4">
              <ArrowPathIcon className="w-8 h-8 text-indigo-500 animate-spin" />
              <p className="text-gray-400">Loading your apps...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06060c] pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Apps</h1>
            <p className="text-gray-400">
              {apps.length} {apps.length === 1 ? "app" : "apps"} created
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 bg-white/5 backdrop-blur-md rounded-lg p-1 border border-white/10">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === "table"
                ? "bg-white/10 text-white shadow-sm ring-1 ring-white/5"
                : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              <TableCellsIcon className="w-4 h-4" />
              Table
            </button>
            <button
              onClick={() => setViewMode("tile")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === "tile"
                ? "bg-white/10 text-white shadow-sm ring-1 ring-white/5"
                : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              <Squares2X2Icon className="w-4 h-4" />
              Tile
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-900/50 text-red-400 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && apps.length === 0 && !error && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Squares2X2Icon className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No apps yet</h3>
            <p className="text-gray-400 mb-6">
              Create your first app to see it here
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
            >
              Create App
            </button>
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" && apps.length > 0 && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {apps.map((app, index) => (
                  <tr
                    key={app.uuid || index}
                    className="border-b border-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{app.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-400 line-clamp-2">
                        {app.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${app.status === 'active'
                        ? 'bg-green-900/20 text-green-400 border border-green-900/50'
                        : app.status === 'inactive'
                          ? 'bg-gray-900/20 text-gray-400 border border-gray-900/50'
                          : 'bg-yellow-900/20 text-yellow-400 border border-yellow-900/50'
                        }`}>
                        {app.status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/my-apps/${app.uuid}`);
                        }}
                        className="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tile View */}
        {viewMode === "tile" && apps.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app, index) => (
              <div
                key={app.uuid || index}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">
                    {app.name}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${app.status === 'active'
                    ? 'bg-green-900/20 text-green-400 border border-green-900/50'
                    : app.status === 'inactive'
                      ? 'bg-gray-900/20 text-gray-400 border border-gray-900/50'
                      : 'bg-yellow-900/20 text-yellow-400 border border-yellow-900/50'
                    }`}>
                    {app.status || 'N/A'}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                  {app.description}
                </p>
                <div className="flex items-center justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/my-apps/${app.uuid}`);
                    }}
                    className="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    View →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

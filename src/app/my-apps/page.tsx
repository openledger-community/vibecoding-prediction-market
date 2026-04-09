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
    <div className="min-h-screen bg-[#06070a] pt-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-100 mb-3 tracking-tight">My Apps</h1>
            <p className="text-slate-500 font-medium">
              {apps.length} {apps.length === 1 ? "app" : "apps"} created <span className="mx-2 text-white/5">|</span> <span className="text-blue-500/80">Management Console</span>
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 bg-[#0d0f16]/40 backdrop-blur-md rounded-xl p-1.5 border border-white/10 shadow-lg self-start">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${viewMode === "table"
                ? "bg-blue-600/10 text-blue-400 shadow-inner ring-1 ring-blue-500/30"
                : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                }`}
            >
              <TableCellsIcon className="w-4 h-4" />
              Table
            </button>
            <button
              onClick={() => setViewMode("tile")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${viewMode === "tile"
                ? "bg-blue-600/10 text-blue-400 shadow-inner ring-1 ring-blue-500/30"
                : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                }`}
            >
              <Squares2X2Icon className="w-4 h-4" />
              Tile
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-rose-900/20 border border-rose-900/50 text-rose-400 rounded-xl p-5 mb-8 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
              {error}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && apps.length === 0 && !error && (
          <div className="bg-[#0d0f16]/40 backdrop-blur-md border border-white/5 rounded-3xl p-20 text-center shadow-2xl">
            <div className="w-20 h-20 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20 shadow-inner">
              <Squares2X2Icon className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-100 mb-3">No applications found</h3>
            <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">
              Start your journey by creating your first vibe-coded application today.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/20 animate-shimmer"
            >
              Create New App
            </button>
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" && apps.length > 0 && (
          <div className="bg-[#0d0f16]/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/5">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    <th className="px-8 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Name
                    </th>
                    <th className="px-8 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Description
                    </th>
                    <th className="px-8 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Status
                    </th>
                    <th className="px-8 py-5 text-right text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {apps.map((app, index) => (
                    <tr
                      key={app.uuid || index}
                      className="group hover:bg-white/5 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{app.name}</div>
                        <div className="text-[10px] font-mono text-slate-600 mt-1 uppercase tracking-tighter">{app.uuid?.slice(0, 8)}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm text-slate-400 line-clamp-2 max-w-md leading-relaxed">
                          {app.description}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-inner ${app.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : app.status === 'inactive'
                            ? 'bg-slate-800/50 text-slate-500 border border-white/5'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${app.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-500'}`}></div>
                          {app.status || 'N/A'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/my-apps/${app.uuid}`);
                          }}
                          className="text-xs font-bold bg-blue-500/10 hover:bg-blue-600 hover:text-white text-blue-400 px-4 py-2 rounded-lg border border-blue-500/20 hover:border-blue-500 transition-all active:scale-95"
                        >
                          View Console
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tile View */}
        {viewMode === "tile" && apps.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app, index) => (
              <div
                key={app.uuid || index}
                className="group relative flex flex-col bg-[#0d0f16]/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:bg-[#161a24]/60 hover:border-blue-500/30 transition-all duration-300 shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                      {app.name}
                    </h3>
                    <div className="text-[10px] font-mono text-slate-600 mt-0.5 uppercase tracking-tighter">{app.uuid?.slice(0, 8)}</div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${app.status === 'active'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : app.status === 'inactive'
                      ? 'bg-slate-800/50 text-slate-500 border border-white/5'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${app.status === 'active' ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
                    {app.status || 'N/A'}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-8 line-clamp-3 leading-relaxed font-medium">
                  {app.description}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">Vibe Certified</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/my-apps/${app.uuid}`);
                    }}
                    className="text-xs font-bold bg-white/5 hover:bg-blue-600 hover:text-white text-slate-300 px-4 py-2 rounded-xl border border-white/5 hover:border-blue-500 transition-all active:scale-95"
                  >
                    Manage →
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

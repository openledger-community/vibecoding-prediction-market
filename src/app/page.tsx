"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PromptBox from "@/components/PromptBox";
import MarketList from "@/components/MarketList";
import MarketSkeleton from "@/components/MarketSkeleton";
import CategoryPicker from "@/components/CategoryPicker";
import VibeCodingForm from "@/components/VibeCodingForm";
import type { Taxonomy, Market, DesignPatternId, CategoryTags } from "@/lib/types";
import { getWalletAuth } from "@/lib/walletAuth";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const isWalletMode = process.env.NEXT_PUBLIC_AUTH_MODE === "walletconnect";

import NavigationTabs from "@/components/NavigationTabs";
import StatsRow from "@/components/StatsRow";
import CategoryGrid from "@/components/CategoryGrid";
import PreviewModal from "@/components/PreviewModal";
import LoginModal from "@/components/LoginModal";
import CategoryModal from "@/components/CategoryModal";


import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [markets, setMarkets] = useState<Market[] | null>(null);
  const [categoryTags, setCategoryTags] = useState<CategoryTags | null>(null);

  const [fallback, setFallback] = useState(false);
  const [taxonomy, setTaxonomy] = useState<Taxonomy | null>(null);

  // Vibe coding flow
  const [showVibeForm, setShowVibeForm] = useState(false);
  const [vibeLoading, setVibeLoading] = useState(false);
  const [vibeSuccess, setVibeSuccess] = useState(false);
  const [vibeChat, setVibeChat] = useState<any | null>(null);
  const [vibeError, setVibeError] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [currentDescription, setCurrentDescription] = useState<string>("");

  // Active tab
  const [activeTab, setActiveTab] = useState("Search");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modals
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Live taxonomy + per-category series counts (fetched once on mount)
  const [taxonomyData, setTaxonomyData] = useState<{
    taxonomy: Taxonomy;
    categoryCounts: Record<string, number>;
  } | null>(null);

  const [isPromptSearch, setIsPromptSearch] = useState(false);

  useEffect(() => {
    fetch("/api/taxonomy")
      .then((r) => r.json())
      .then((d) => setTaxonomyData(d))
      .catch(() => { }); // graceful — skeleton stays until data arrives
  }, []);

  const reset = () => {
    setMarkets(null);
    setCategoryTags(null);
    setFallback(false);
    setTaxonomy(null);
    setError(null);
    setShowVibeForm(false);
    setVibeSuccess(false);
    setVibeChat(null);
    setVibeError(null);
    setCurrentPrompt("");
    setCurrentDescription("");
  };

  const handleVibeSubmit = async (
    displayName: string,
    displayDescription: string,
    designPattern: DesignPatternId
  ) => {
    setVibeLoading(true);
    setVibeLoading(true);
    // Keep form open to show "Deploying..." state
    // setShowVibeForm(false); 
    // Set temp prompt for the loading view
    setCurrentPrompt(`${displayName} — ${displayDescription}`);
    setCurrentDescription(displayDescription);

    try {
      const res = await fetchWithAuth("/api/vibe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_tags: categoryTags,
          displayName,
          displayDescription,
          designPattern,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        // Redirect to the new App View page using the returned UUID
        if (data.data?.uuid) {
          router.push(`/my-apps/${data.data.uuid}`);
          return; // Stop here, page transition will happen
        }

        // Fallback (shouldn't happen if backend is correct)
        setVibeSuccess(true);
        setVibeChat(data.data);
      } else {
        // Fallback: Show demo if API fails
        console.warn("Vibe API failed, falling back to demo.");
        try {
          const err = await res.json();
          console.error("Vibe API Error Response:", err);
          // Optionally set error state if user wants feedback, but request said console only
          // setVibeError(err.error || "API Error");
        } catch (e) {
          console.error("Vibe API failed with non-JSON response", res.status);
        }
      }
    } catch (e) {
      // Fallback: Show demo on network error
      console.warn("Network error, falling back to demo.", e);
      // setVibeError("Network Error");
    } finally {
      setVibeLoading(false);
    }
  };

  const doSearch = async (body: Record<string, unknown>) => {
    const authed = isWalletMode ? !!getWalletAuth()?.token : !!session;
    if (!authed) {
      setShowLoginModal(true);
      return;
    }
    setActiveTab("Search"); // always land on Search tab so results are visible
    reset();
    setLoading(true);

    try {
      const res = await fetchWithAuth("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        setError(err.error || "Request failed");
        return;
      }

      const data = await res.json();

      if ("fallback" in data && data.fallback) {
        setFallback(true);
        setTaxonomy(data.taxonomy);
      } else {
        setCategoryTags(data.category_tags);
        setMarkets(data.markets);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handlePromptSubmit = async () => {
    const authed = isWalletMode ? !!getWalletAuth()?.token : !!session;
    if (!authed) {
      setShowLoginModal(true);
      return;
    }
    if (!prompt.trim()) return;
    setIsPromptSearch(true);
    setLoading(true);
    reset();
    try {
      const res = await fetchWithAuth("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          category: selectedCategory === "All" ? undefined : selectedCategory
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        setError(err.error || "Request failed");
        return;
      }

      const data = await res.json();

      if ("fallback" in data && data.fallback) {
        setFallback(true);
        setTaxonomy(data.taxonomy);
      } else {
        setCategoryTags(data.category_tags);
        setMarkets(data.markets);
        setShowVibeForm(true);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
      setIsPromptSearch(false);
    }
  };

  const handlePickerSearch = (category: string, tags: string[]) => {
    doSearch({ category, tags });
  };

  // Clicking a category card (Categories tab or Search idle) fires a search
  const handleCategoryClick = (category: string) => {
    doSearch({ category, tags: [] });
  };


  // True when we have any search output (results, error, fallback, or in-flight)
  const hasSearchOutput = markets !== null || fallback || error || (loading && !isPromptSearch);

  return (
    <main className="h-screen bg-[#06060c] text-white flex flex-col items-center overflow-hidden">
      {!hasSearchOutput ? (
        /* ── IDLE STATE (Centered Stack) ─────────────────────────────────── */
        <div className="flex-1 w-full max-w-7xl px-6 flex flex-col items-center justify-center animate-in fade-in duration-700">
          <div className="text-center mb-10">
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4 text-white">
              What do you want to <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">create?</span>
            </h2>
          </div>

          <PromptBox
            prompt={prompt}
            onChange={setPrompt}
            onSubmit={handlePromptSubmit}
            loading={loading}
            selectedCategory={selectedCategory}
            onCategoryClick={() => setShowCategoryModal(true)}
            hideDisclaimer={false}
          />

          <div className="w-full mt-4">
            {/* <StatsRow
              totalMarkets={
                taxonomyData
                  ? Object.values(taxonomyData.categoryCounts).reduce((a, b) => a + b, 0)
                  : undefined
              }
            /> */}
          </div>
        </div>
      ) : (
        /* ── SEARCH / RESULTS STATE (Split Layout) ────────────────────────── */
        <>
          <div className="flex-1 w-full max-w-7xl px-6 overflow-y-auto pt-24 pb-50 scrollbar-hide animate-in slide-in-from-bottom-2 duration-500">
            {/* Categories Tab */}
            {activeTab === "Categories" && (
              <CategoryGrid
                taxonomy={taxonomyData?.taxonomy}
                categoryCounts={taxonomyData?.categoryCounts}
                onCategoryClick={handleCategoryClick}
              />
            )}

            {/* Search Content */}
            {activeTab === "Search" && (
              <div className="w-full">
                {/* Loading Skeleton */}
                {loading && <MarketSkeleton />}

                {/* Error banner */}
                {error && (
                  <div className="w-full max-w-3xl mx-auto mt-4 text-red-400 text-sm bg-red-900/20 border border-red-900/50 p-4 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Fallback: manual category + tag picker */}
                {fallback && taxonomy && (
                  <CategoryPicker taxonomy={taxonomy} onSearch={handlePickerSearch} loading={loading} />
                )}

                {/* Search results */}
                {categoryTags && markets !== null && (
                  <div className="w-full max-w-4xl mx-auto">
                    {showVibeForm ? (
                      <div className="fixed inset-0 z-40 bg-[#06060c] overflow-y-auto pt-16 custom-scrollbar scrollbar-hide animate-in fade-in duration-500">
                        <VibeCodingForm
                          categoryTags={categoryTags}
                          onSubmit={handleVibeSubmit}
                          loading={vibeLoading}
                          onCancel={() => setShowVibeForm(false)}
                        />
                      </div>
                    ) : (
                      <>
                        <MarketList
                          categoryTags={categoryTags}
                          markets={markets}
                          showVibeButton={markets.length > 0 && !showVibeForm && !vibeSuccess}
                          onVibeClick={() => setShowVibeForm(true)}
                        />

                        {/* Success banner */}
                        {vibeSuccess && (
                          <div className="w-full mt-6 bg-green-900 border border-green-700 text-green-300 rounded-lg px-4 py-3 text-sm">
                            Submitted. Your vibe coding request is queued.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Fixed Bottom Search Box */}
          {!showVibeForm && (
            <div className="w-full fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#06060c] via-[#06060c] to-transparent pt-10 pb-6 px-6 z-40">
              <div className="max-w-4xl mx-auto">
                <PromptBox
                  prompt={prompt}
                  onChange={setPrompt}
                  onSubmit={handlePromptSubmit}
                  loading={loading}
                  selectedCategory={selectedCategory}
                  onCategoryClick={() => setShowCategoryModal(true)}
                  hideDisclaimer={true}
                />
              </div>
            </div>
          )}
        </>
      )}



      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        taxonomy={taxonomyData?.taxonomy || null}
        categoryCounts={taxonomyData?.categoryCounts || null}
        onSelect={setSelectedCategory}
        selectedCategory={selectedCategory}
      />
    </main>
  );
}

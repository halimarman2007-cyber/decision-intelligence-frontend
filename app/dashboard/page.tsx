"use client";

import { useEffect, useState } from "react";
import { fetchMarkets } from "@/lib/api";
import { Market, TrendDirection } from "@/lib/mock-data";

import { InsightCard } from "@/components/insight-card";
import { RiskSignalCard } from "@/components/risk-signal-card";
import { MarketAlert } from "@/components/market-alert";
import { MarketSelectorPanel } from "@/components/market-selector-panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* ---------------- helpers ---------------- */

const getTrendLabel = (trend: TrendDirection) => {
  switch (trend) {
    case "bullish":
      return "↑ Bullish";
    case "bearish":
      return "↓ Bearish";
    case "neutral":
      return "→ Neutral";
    default:
      return trend;
  }
};

const getTrendColor = (trend: TrendDirection) => {
  switch (trend) {
    case "bullish":
      return "border-green-500 bg-green-50 dark:bg-green-950";
    case "bearish":
      return "border-red-500 bg-red-50 dark:bg-red-950";
    case "neutral":
      return "border-yellow-500 bg-yellow-50 dark:bg-yellow-950";
    default:
      return "";
  }
};

/* ---------------- page ---------------- */

export default function DashboardPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [selectedMarkets, setSelectedMarkets] = useState<Market[]>([]);
  const [focusedMarket, setFocusedMarket] = useState<Market | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 THIS IS THE KEY FIX
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchMarkets();
        setMarkets(data);
        setSelectedMarkets(data);
        setFocusedMarket(data[0] ?? null);
      } catch (e) {
        console.error("Failed to load markets", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <div className="p-6">Loading markets…</div>;
  }

  if (!focusedMarket) {
    return <div className="p-6">No market data available</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-8 p-6 md:p-8">

        {/* Selector */}
        <MarketSelectorPanel
          selectedMarkets={selectedMarkets}
          onAddMarket={(m) => {
            setSelectedMarkets([...selectedMarkets, m]);
            setFocusedMarket(m);
          }}
          onRemoveMarket={(id) => {
            const filtered = selectedMarkets.filter(m => m.id !== id);
            setSelectedMarkets(filtered);
            if (focusedMarket.id === id && filtered.length > 0) {
              setFocusedMarket(filtered[0]);
            }
          }}
        />

        {/* Trend */}
        <div className={`rounded-lg border-2 p-6 ${getTrendColor(focusedMarket.trendDirection)}`}>
          <Badge variant="outline" className="mb-2">
            {getTrendLabel(focusedMarket.trendDirection)}
          </Badge>
          <h2 className="text-2xl font-bold">{focusedMarket.name}</h2>
          <p className="opacity-80">{focusedMarket.trendRationale}</p>
        </div>

        {/* Alerts */}
        {focusedMarket.alerts.map(a => (
          <MarketAlert key={a.id} alert={a} />
        ))}

        {/* Insights */}
        {focusedMarket.insights.map(i => (
          <InsightCard key={i.id} insight={i} />
        ))}

        {/* Risks */}
        {focusedMarket.riskSignals.map(r => (
          <RiskSignalCard key={r.id} risk={r} />
        ))}
      </div>
    </div>
  );
}

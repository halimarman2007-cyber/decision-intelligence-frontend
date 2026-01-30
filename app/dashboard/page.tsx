// app/dashboard/page.tsx
// SERVER COMPONENT — FORCE DYNAMIC RENDERING

export const dynamic = "force-dynamic";
export const revalidate = 0;

import DashboardClient from "./dashboard-client";
import { fetchMarkets } from "@/lib/api";
import { Market } from "@/lib/mock-data";

export default async function DashboardPage() {
  let markets: Market[] = [];

  try {
    markets = await fetchMarkets();
  } catch (error) {
    console.error("Failed to fetch markets:", error);
  }

  return <DashboardClient markets={markets} />;
}

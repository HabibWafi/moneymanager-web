import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const CACHE_MAX_AGE_MS = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get("ids");
  if (!idsParam) {
    return NextResponse.json(
      { error: "Missing required query parameter: ids" },
      { status: 400 }
    );
  }

  const ids = idsParam.split(",").map((id) => id.trim()).filter(Boolean);
  if (ids.length === 0) {
    return NextResponse.json(
      { error: "No valid ids provided" },
      { status: 400 }
    );
  }

  const supabase = createClient();
  const cacheKeys = ids.map((id) => `crypto:${id}`);
  const now = new Date();

  // Check cache
  const { data: cached } = await supabase
    .from("price_cache")
    .select("id, price_idr, price_usd, fetched_at")
    .in("id", cacheKeys);

  const result: Record<string, { idr: number; usd: number }> = {};
  const staleIds: string[] = [];

  for (const id of ids) {
    const key = `crypto:${id}`;
    const row = cached?.find((r) => r.id === key);

    if (row && row.fetched_at) {
      const fetchedAt = new Date(row.fetched_at);
      if (now.getTime() - fetchedAt.getTime() < CACHE_MAX_AGE_MS) {
        result[id] = { idr: Number(row.price_idr), usd: Number(row.price_usd) };
        continue;
      }
    }

    staleIds.push(id);
  }

  // If everything was cached and fresh, return immediately
  if (staleIds.length === 0) {
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  }

  // Fetch fresh prices from CoinGecko
  try {
    const joined = staleIds.join(",");
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${joined}&vs_currencies=idr,usd`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error(`CoinGecko responded with ${res.status}`);
    }

    const data = await res.json();

    const upsertRows: {
      id: string;
      price_idr: number;
      price_usd: number;
      fetched_at: string;
    }[] = [];

    for (const id of staleIds) {
      if (data[id]?.idr != null && data[id]?.usd != null) {
        result[id] = { idr: data[id].idr, usd: data[id].usd };
        upsertRows.push({
          id: `crypto:${id}`,
          price_idr: data[id].idr,
          price_usd: data[id].usd,
          fetched_at: now.toISOString(),
        });
      } else {
        // CoinGecko didn't return this id — use stale cache if available
        const key = `crypto:${id}`;
        const row = cached?.find((r) => r.id === key);
        if (row) {
          result[id] = { idr: Number(row.price_idr), usd: Number(row.price_usd) };
        }
      }
    }

    // Upsert into cache
    if (upsertRows.length > 0) {
      await supabase
        .from("price_cache")
        .upsert(upsertRows, { onConflict: "id" });
    }
  } catch {
    // External API failed — fall back to stale cached data for remaining ids
    for (const id of staleIds) {
      const key = `crypto:${id}`;
      const row = cached?.find((r) => r.id === key);
      if (row) {
        result[id] = { idr: Number(row.price_idr), usd: Number(row.price_usd) };
      }
    }
  }

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
    },
  });
}

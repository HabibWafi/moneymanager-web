import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const CACHE_MAX_AGE_MS = 5 * 60 * 1000; // 5 minutes

async function fetchSymbolFromYahoo(
  symbol: string
): Promise<{ idr: number | null; usd: number | null } | null> {
  const res = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  const data = await res.json();
  const meta = data?.chart?.result?.[0]?.meta;
  if (!meta?.regularMarketPrice) return null;

  const price: number = meta.regularMarketPrice;
  const isIDX = symbol.toUpperCase().endsWith(".JK");

  return {
    idr: isIDX ? price : null,
    usd: isIDX ? null : price,
  };
}

export async function GET(request: NextRequest) {
  const symbolsParam = request.nextUrl.searchParams.get("symbols");
  if (!symbolsParam) {
    return NextResponse.json(
      { error: "Missing required query parameter: symbols" },
      { status: 400 }
    );
  }

  const symbols = symbolsParam.split(",").map((s) => s.trim()).filter(Boolean);
  if (symbols.length === 0) {
    return NextResponse.json(
      { error: "No valid symbols provided" },
      { status: 400 }
    );
  }

  const supabase = createClient();
  const cacheKeys = symbols.map((s) => `stock:${s}`);
  const now = new Date();

  // Check cache
  const { data: cached } = await supabase
    .from("price_cache")
    .select("id, price_idr, price_usd, fetched_at")
    .in("id", cacheKeys);

  const result: Record<string, { idr: number | null; usd: number | null }> = {};
  const staleSymbols: string[] = [];

  for (const symbol of symbols) {
    const key = `stock:${symbol}`;
    const row = cached?.find((r) => r.id === key);

    if (row && row.fetched_at) {
      const fetchedAt = new Date(row.fetched_at);
      if (now.getTime() - fetchedAt.getTime() < CACHE_MAX_AGE_MS) {
        result[symbol] = {
          idr: row.price_idr != null ? Number(row.price_idr) : null,
          usd: row.price_usd != null ? Number(row.price_usd) : null,
        };
        continue;
      }
    }

    staleSymbols.push(symbol);
  }

  // If everything was cached and fresh, return immediately
  if (staleSymbols.length === 0) {
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  }

  // Fetch stale symbols in parallel
  const fetchResults = await Promise.allSettled(
    staleSymbols.map(async (symbol) => {
      const priceData = await fetchSymbolFromYahoo(symbol);
      return { symbol, priceData };
    })
  );

  const upsertRows: {
    id: string;
    price_idr: number | null;
    price_usd: number | null;
    fetched_at: string;
  }[] = [];

  for (const settled of fetchResults) {
    if (settled.status === "fulfilled" && settled.value.priceData) {
      const { symbol, priceData } = settled.value;
      result[symbol] = priceData;
      upsertRows.push({
        id: `stock:${symbol}`,
        price_idr: priceData.idr,
        price_usd: priceData.usd,
        fetched_at: now.toISOString(),
      });
    } else {
      // Individual fetch failed — fall back to stale cache
      const symbol =
        settled.status === "fulfilled"
          ? settled.value.symbol
          : staleSymbols[fetchResults.indexOf(settled)];
      const key = `stock:${symbol}`;
      const row = cached?.find((r) => r.id === key);
      if (row) {
        result[symbol] = {
          idr: row.price_idr != null ? Number(row.price_idr) : null,
          usd: row.price_usd != null ? Number(row.price_usd) : null,
        };
      }
    }
  }

  // Upsert into cache
  if (upsertRows.length > 0) {
    await supabase
      .from("price_cache")
      .upsert(upsertRows, { onConflict: "id" });
  }

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
    },
  });
}

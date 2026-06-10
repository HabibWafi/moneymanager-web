export async function fetchCryptoPrices(
  ids: string[]
): Promise<Record<string, { idr: number; usd: number }>> {
  try {
    const joined = ids.join(",");
    const res = await fetch(`/api/prices/crypto?ids=${joined}`);
    if (!res.ok) throw new Error("Failed to fetch crypto prices");
    return await res.json();
  } catch {
    return {};
  }
}

export async function fetchStockPrices(
  symbols: string[]
): Promise<Record<string, { idr: number | null; usd: number | null }>> {
  try {
    const joined = symbols.join(",");
    const res = await fetch(`/api/prices/stocks?symbols=${joined}`);
    if (!res.ok) throw new Error("Failed to fetch stock prices");
    return await res.json();
  } catch {
    return {};
  }
}

export async function fetchStockPrice(
  symbol: string
): Promise<number | null> {
  const result = await fetchStockPrices([symbol]);
  const data = result[symbol];
  if (!data) return null;
  return data.idr ?? data.usd ?? null;
}

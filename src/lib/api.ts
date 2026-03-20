export async function fetchCryptoPrices(ids: string[]): Promise<Record<string, number>> {
  try {
    const joined = ids.join(",");
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${joined}&vs_currencies=idr`
    );
    if (!res.ok) throw new Error("Failed");
    const data = await res.json();
    const prices: Record<string, number> = {};
    for (const id of ids) {
      if (data[id]?.idr) prices[id] = data[id].idr;
    }
    return prices;
  } catch {
    return {};
  }
}

export async function fetchStockPrice(kode: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${kode}.JK?interval=1d&range=1d`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
    return price ?? null;
  } catch {
    return null;
  }
}

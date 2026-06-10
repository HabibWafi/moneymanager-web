export const CRYPTO_LIST = [
  { id: "bitcoin", sym: "BTC", nama: "Bitcoin" },
  { id: "ethereum", sym: "ETH", nama: "Ethereum" },
  { id: "binancecoin", sym: "BNB", nama: "BNB" },
  { id: "solana", sym: "SOL", nama: "Solana" },
  { id: "ripple", sym: "XRP", nama: "XRP" },
  { id: "cardano", sym: "ADA", nama: "Cardano" },
  { id: "dogecoin", sym: "DOGE", nama: "Dogecoin" },
  { id: "polkadot", sym: "DOT", nama: "Polkadot" },
  { id: "avalanche-2", sym: "AVAX", nama: "Avalanche" },
  { id: "chainlink", sym: "LINK", nama: "Chainlink" },
];

export const SAHAM_LIST = [
  "BBCA", "BBRI", "BMRI", "BBNI", "TLKM", "ASII", "UNVR", "HMSP",
  "GGRM", "ICBP", "INDF", "KLBF", "PGAS", "SMGR", "ANTM", "PTBA",
  "ADRO", "ITMG", "UNTR", "MDKA",
];

export const US_STOCK_LIST = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "BRK-B",
  "JPM", "V", "JNJ", "WMT", "PG", "MA", "UNH", "HD", "DIS", "BAC",
  "NFLX", "ADBE", "CRM", "AMD", "INTC", "PYPL", "COIN",
];

export const KI = [
  "Salary", "Allowance", "Bonus/THR", "Freelance", "Business", "Investment", "Other",
];

export const KE = [
  "Food", "Transport", "Shopping", "Bills", "Entertainment",
  "Health", "Education", "Installment", "Donation", "Other",
];

export const BANK_COLORS = [
  "#4F46E5", "#7C3AED", "#2563EB", "#0891B2", "#059669",
  "#D97706", "#DC2626", "#DB2777", "#4338CA", "#0D9488",
];

export const INV_TIPE_LABEL: Record<string, string> = {
  saham: "Stocks",
  emas: "Gold",
  kripto: "Crypto",
  obligasi: "Bonds",
  deposito: "Deposits",
  reksadana: "Mutual Funds",
};

export const INV_TIPE_COLORS: Record<string, string> = {
  saham: "#4F46E5",
  emas: "#D97706",
  kripto: "#7C3AED",
  obligasi: "#059669",
  deposito: "#0891B2",
  reksadana: "#DB2777",
};

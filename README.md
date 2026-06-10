# Money Manager

A personal finance management web app built with Next.js, Supabase, and Tailwind CSS. Track your bank accounts, income, expenses, debts, and investments (stocks, crypto, gold, bonds, deposits, mutual funds) with real-time price updates.

## Features

- **Multi-currency support** — Track assets in IDR and USD
- **Investment tracking** — Stocks (Indonesia & US), crypto, gold, bonds, deposits, mutual funds
- **Auto price updates** — Real-time prices via Yahoo Finance & CoinGecko
- **Cash flow management** — Routine & extra income/expenses with monthly breakdown
- **Debt tracking** — Installments and loans with progress visualization
- **Analytics** — Monthly trends, expense breakdown, wealth allocation charts
- **6-month projection** — Forecast your finances based on routine income/expenses
- **PWA** — Installable on mobile devices
- **Google OAuth** — Secure authentication locked to your email
- **Supabase backend** — PostgreSQL with Row Level Security

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **State**: Zustand
- **Database**: Supabase (PostgreSQL + Auth)
- **Charts**: Recharts
- **Deployment**: Vercel

## Setup

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Set up Supabase:
   - Create a new Supabase project
   - Run the migration in `supabase/migrations/001_initial_schema.sql`
   - Enable Google OAuth in Supabase Auth settings
   - Fill in `.env.local` with your Supabase credentials
5. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (for price cache) |
| `ALLOWED_EMAIL` | Email allowed to log in (single-user mode) |

## Deployment

Deploy to Vercel:

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

## License

MIT

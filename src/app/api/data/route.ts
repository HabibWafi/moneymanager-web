import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "keuangan.json");

const DEFAULT_DATA = {
  banks: [],
  bankTrf: [],
  pendapatanRutin: [],
  incEx: [],
  expRutin: [],
  expEx: [],
  hutang: [],
  inv: [],
  cuti: {},
  cryptoCache: {},
};

function readData() {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      const dir = path.dirname(DATA_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(DATA_PATH, JSON.stringify(DEFAULT_DATA, null, 2));
      return { ...DEFAULT_DATA };
    }
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { ...DEFAULT_DATA };
  }
}

function writeData(data: Record<string, unknown>) {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export async function GET(req: NextRequest) {
  const data = readData();
  const key = req.nextUrl.searchParams.get("key");
  if (key) {
    return NextResponse.json(data[key] ?? null);
  }
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { key, value } = body;
  const data = readData();
  data[key] = value;
  writeData(data);
  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  writeData(body);
  return NextResponse.json({ ok: true });
}

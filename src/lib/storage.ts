import { AppData } from "./types";
import { DEFAULT_DATA } from "./constants";

export async function loadAllData(): Promise<AppData> {
  try {
    const res = await fetch("/api/data", { cache: "no-store" });
    if (!res.ok) return { ...DEFAULT_DATA };
    return await res.json();
  } catch {
    return { ...DEFAULT_DATA };
  }
}

export async function saveField(key: string, value: unknown): Promise<void> {
  await fetch("/api/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  });
}

export async function saveAllData(data: AppData): Promise<void> {
  await fetch("/api/data", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

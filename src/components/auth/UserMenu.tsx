"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "./AuthProvider";

export default function UserMenu() {
  const { user, loading, signOut } = useAuth();

  if (loading || !user) return null;

  const avatarUrl = user.user_metadata?.avatar_url;
  const email = user.email ?? "";
  const name = user.user_metadata?.full_name ?? email;
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3 px-3 py-2">
      {/* Avatar */}
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="w-8 h-8 rounded-full shrink-0"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
          {initials}
        </div>
      )}

      {/* Email */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700 truncate">{name}</p>
        <p className="text-xs text-slate-400 truncate">{email}</p>
      </div>

      {/* Sign Out */}
      <button
        onClick={signOut}
        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
        title="Sign out"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}

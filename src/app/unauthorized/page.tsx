import { ShieldX } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4">
            <ShieldX className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Akses Ditolak
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            Aplikasi ini bersifat privat. Hanya pengguna yang diizinkan yang
            dapat mengaksesnya.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors text-sm"
          >
            Coba akun lain
          </Link>
        </div>
      </div>
    </div>
  );
}

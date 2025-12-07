import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  // 1. Cek Login
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  // 2. Cek Role Admin di Database
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();

  // ⛔ KALAU BUKAN ADMIN, TENDANG KE DASHBOARD
  if (!profile || !profile.is_admin) {
    return redirect("/dashboard");
  }

  // ✅ KALAU ADMIN, SILAHKAN MASUK
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Header Khusus Admin (Sticky + Glassmorphism) */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200/60 bg-white/80 backdrop-blur-xl supports-backdrop-filter:bg-white/60">
        <div className="flex h-16 items-center justify-between px-8 max-w-7xl mx-auto">
          {/* Logo Area */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-100 text-rose-600 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-bold text-lg text-slate-800 leading-none">Admin Panel</span>
              <span className="text-[10px] font-semibold text-rose-500 tracking-wider uppercase">NurseCare System</span>
            </div>
          </div>

          {/* Right Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              Live Mode
            </div>

            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Kembali ke App</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Konten Halaman Admin */}
      <main className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">{children}</main>
    </div>
  );
}

import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HeartPulse, LayoutDashboard, FileText, User, LogOut, History } from "lucide-react"; // Icon bawaan Shadcn/Lucide

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  // 1. Cek User (Security Layer)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  // 2. Logic Logout
  const signOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  // 3. Ambil data profil (untuk nama/avatar)
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR (Kiri) */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-6 border-b flex items-center gap-2">
          <HeartPulse className="text-blue-600 h-6 w-6" />
          <span className="font-bold text-xl tracking-tight">NurseCare</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/self-check">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <HeartPulse className="h-4 w-4" /> Cek Kesehatan
            </Button>
          </Link>
          <Link href="/dashboard/history">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <History className="h-4 w-4" /> Riwayat
            </Button>
          </Link>
          <Link href="/dashboard/educare">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <FileText className="h-4 w-4" /> Educare
            </Button>
          </Link>
          {/* Menu Admin (Cuma muncul kalau user admin) */}
          {profile?.is_admin && (
            <Link href="/admin">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <User className="h-4 w-4" /> Admin Panel
              </Button>
            </Link>
          )}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4 px-2">
            <img
              src={profile?.avatar_url || "https://github.com/shadcn.png"}
              alt="Avatar"
              className="h-8 w-8 rounded-full bg-gray-200"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{profile?.full_name || "Perawat"}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>

          <form action={signOut}>
            <Button
              variant="outline"
              type="submit"
              className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" /> Keluar
            </Button>
          </form>
        </div>
      </aside>

      {/* KONTEN UTAMA (Kanan) */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Header Mobile (Cuma muncul di HP) */}
        <div className="md:hidden mb-6 flex justify-between items-center">
          <h1 className="font-bold text-xl">NurseCare</h1>
          <form action={signOut}>
            <Button size="sm" variant="outline">
              Logout
            </Button>
          </form>
        </div>

        {children}
      </main>
    </div>
  );
}

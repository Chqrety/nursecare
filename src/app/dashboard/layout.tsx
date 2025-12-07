import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HeartPulse, LayoutDashboard, FileText, User, LogOut, History, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  // 1. Cek User
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

  // 3. Ambil data profil
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  // --- COMPONENT MENU (Biar gak ngetik 2x buat Desktop & Mobile) ---
  const MenuItems = () => (
    <nav className="flex flex-col space-y-2 mt-4">
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
      {/* Menu Admin */}
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
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* === SIDEBAR DESKTOP (Hidden di Mobile) === */}
      <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-white/50 hidden md:flex flex-col fixed h-full z-10 shadow-lg">
        <div className="p-6 border-b flex items-center gap-2 h-16">
          <HeartPulse className="text-blue-600 h-6 w-6" />
          <span className="font-bold text-xl tracking-tight">NurseCare</span>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <MenuItems />
        </div>

        <div className="p-4 border-t bg-white">
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

      {/* === KONTEN UTAMA === */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* HEADER MOBILE (Muncul cuma di HP) */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <HeartPulse className="text-blue-600 h-6 w-6" />
            <span className="font-bold text-lg">NurseCare</span>
          </div>

          {/* Tombol Hamburger & Drawer */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetHeader className="p-6 border-b text-left">
                <SheetTitle className="flex items-center gap-2">
                  <HeartPulse className="text-blue-600 h-6 w-6" />
                  NurseCare
                </SheetTitle>
              </SheetHeader>

              <div className="p-4 flex flex-col h-[calc(100vh-80px)] justify-between">
                {/* Menu Navigasi */}
                <div>
                  <MenuItems />
                </div>

                {/* Footer (Profile & Logout) */}
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-3 mb-4 px-2">
                    <img
                      src={profile?.avatar_url || "https://github.com/shadcn.png"}
                      alt="Avatar"
                      className="h-8 w-8 rounded-full bg-gray-200"
                    />
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium truncate">{profile?.full_name}</p>
                    </div>
                  </div>
                  <form action={signOut}>
                    <Button
                      variant="outline"
                      type="submit"
                      className="w-full justify-start gap-2 text-red-600 border-red-200"
                    >
                      <LogOut className="h-4 w-4" /> Keluar
                    </Button>
                  </form>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Isi Halaman */}
        <main className="p-4 md:p-8 overflow-auto flex-1">{children}</main>
      </div>
    </div>
  );
}

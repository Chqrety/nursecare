import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Activity } from "lucide-react";
import { CreateArticleForm } from "@/components/CreateArticleForm";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Hitung Total User
  const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });

  // Hitung Total Artikel
  const { count: articleCount } = await supabase.from("articles").select("*", { count: "exact", head: true });

  const { data: stats } = await supabase.from("site_stats").select("total_visits").single();

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-slate-800">Admin Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: User */}
        <Card className="shadow-sm border-blue-100 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Pengguna</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{userCount}</div>
            <p className="text-xs text-blue-600/80">Perawat terdaftar</p>
          </CardContent>
        </Card>

        {/* Card 2: Artikel */}
        <Card className="shadow-sm border-green-100 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Total Artikel</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{articleCount}</div>
            <p className="text-xs text-green-600/80">Konten educare</p>
          </CardContent>
        </Card>

        {/* Card 3: Total Interaksi (BARU) */}
        <Card className="shadow-sm border-purple-100 bg-purple-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Total Akses</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            {/* Tampilkan data stats, default 0 kalau null */}
            <div className="text-2xl font-bold text-purple-700">{stats?.total_visits || 0}</div>
            <p className="text-xs text-purple-600/80">Interaksi masuk sistem</p>
          </CardContent>
        </Card>
      </div>

      <CreateArticleForm />
    </div>
  );
}

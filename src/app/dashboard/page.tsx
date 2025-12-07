import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Smile, Activity, BookOpen } from "lucide-react";
import { MoodChart } from "@/components/MoodChart";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Ambil nama user
  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user?.id).single();

  const name = profile?.full_name?.split(" ")[0] || "Teman";

  const { data: moodLogs } = await supabase
    .from("mood_logs")
    .select("mood, created_at")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(7);

  return (
    <div className="space-y-8">
      {/* 1. Header Sapaan */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Halo, Ners {name}! 👋</h2>
        <p className="text-gray-500 mt-2">Bagaimana kabarmu hari ini? Jangan lupa istirahat sejenak ya.</p>
      </div>

      {/* 2. Menu Cepat (Grid) */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Card Mood */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Cek Mood Harian</CardTitle>
            <Smile className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">Self Check</div>
            <p className="text-xs text-blue-600 mt-1">Catat perasaanmu hari ini</p>
            <Link href="/dashboard/self-check">
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">Mulai Cek</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Card Stress Test */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-purple-200 bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Tes DASS 21</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">Stress Test</div>
            <p className="text-xs text-purple-600 mt-1">Ukur tingkat kecemasanmu</p>
            <Link href="/dashboard/self-check">
              {/* Nanti kita arahkan ke tab DASS */}
              <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">Ambil Tes</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Card Edukasi */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Pojok Edukasi</CardTitle>
            <BookOpen className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">Educare</div>
            <p className="text-xs text-green-600 mt-1">Tips kesehatan mental perawat</p>
            <Link href="/dashboard/educare">
              <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">Baca Artikel</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <MoodChart data={moodLogs || []} />
      </div>
    </div>
  );
}

import { createClient } from "@/utils/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Smile, Activity, BookOpen, ChevronRight, TrendingUp } from "lucide-react";
import { MoodChart } from "@/components/MoodChart";
import { BreathingExercise } from "@/components/BreathingExercise";
import { RandomQuote } from "@/components/RandomQoute";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user?.id).single();

  const name = profile?.full_name?.split(" ")[0] || "Teman";

  // Ambil data mood 7 hari
  const { data: moodLogs } = await supabase
    .from("mood_logs")
    .select("mood, created_at")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(7);

  return (
    <div className="space-y-8 pb-10">
      {/* === HERO SECTION: Gradient Banner === */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold md:text-4xl">Halo, Ners {name}! 👋</h2>
          <p className="mt-2 text-blue-100 md:text-lg max-w-xl">
            Shift hari ini pasti melelahkan, tapi kamu hebat sudah bertahan. Yuk, cek kondisi mentalmu sebentar.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/dashboard/self-check">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 border-none font-bold rounded-full px-6">
                Mulai Cek Mood
              </Button>
            </Link>
          </div>
        </div>

        {/* Dekorasi Background Bulat-bulat */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-20 h-32 w-32 rounded-full bg-white/20 blur-2xl"></div>
      </div>

      {/* === QUICK MENU: Glass Cards === */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1 */}
        <div className="group relative overflow-hidden rounded-2xl bg-white/60 p-6 shadow-sm border border-white/50 hover:shadow-md transition-all backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Smile className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Cek Mood</h3>
              <p className="text-sm text-gray-500">Catat harianmu</p>
            </div>
          </div>
          <Link href="/dashboard/self-check" className="absolute inset-0" />
        </div>

        {/* Card 2 */}
        <div className="group relative overflow-hidden rounded-2xl bg-white/60 p-6 shadow-sm border border-white/50 hover:shadow-md transition-all backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Tes DASS-21</h3>
              <p className="text-sm text-gray-500">Ukur tingkat stres</p>
            </div>
          </div>
          <Link href="/dashboard/self-check" className="absolute inset-0" />
        </div>

        {/* Card 3 */}
        <div className="group relative overflow-hidden rounded-2xl bg-white/60 p-6 shadow-sm border border-white/50 hover:shadow-md transition-all backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Educare</h3>
              <p className="text-sm text-gray-500">Tips kesehatan</p>
            </div>
          </div>
          <Link href="/dashboard/educare" className="absolute inset-0" />
        </div>
      </div>

      {/* === GRAFIK SECTION === */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Grafik Utama */}
        <div className="md:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Statistik Mood</h3>
              <p className="text-sm text-gray-500">Pantauan emosi 7 hari terakhir</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <MoodChart data={moodLogs || []} />
        </div>

        {/* Quote Card (Samping Grafik) */}
        <div className="h-full min-h-[300px]">
          <RandomQuote />
        </div>

        <BreathingExercise />
      </div>
    </div>
  );
}

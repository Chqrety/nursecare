import { createClient } from "@/utils/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { NoteDialog } from "@/components/NoteDialog";
import { Activity, History, LayoutList } from "lucide-react";

const getSeverityStyle = (level: string) => {
  const styles: Record<string, string> = {
    normal: "bg-emerald-50 text-emerald-700 border-emerald-200",
    mild: "bg-blue-50 text-blue-700 border-blue-200",
    moderate: "bg-yellow-50 text-yellow-700 border-yellow-200",
    severe: "bg-orange-50 text-orange-700 border-orange-200",
    extreme: "bg-red-50 text-red-700 border-red-200",
  };
  // Default ke gray kalau data ngaco
  return styles[level?.toLowerCase()] || "bg-gray-50 text-gray-700 border-gray-200";
};

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Fetch Data MOOD (Limit 20 terakhir)
  const { data: moodLogs } = await supabase
    .from("mood_logs")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(20);

  // 2. Fetch Data DASS (Limit 20 terakhir)
  const { data: dassLogs } = await supabase
    .from("dass_assessments")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-600 to-blue-600 p-8 text-white shadow-xl ">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <History className="w-8 h-8 text-indigo-200" />
            Riwayat Kesehatan
          </h1>
          <p className="mt-2 text-indigo-100 max-w-2xl">
            Jejak perjalanan kesehatan mentalmu. Pantau progres mood dan tingkat stress dari waktu ke waktu untuk
            evaluasi diri yang lebih baik.
          </p>
        </div>

        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* === TABEL 1: RIWAYAT MOOD (Tema: Blue) === */}
        {/* Cocok dengan sisi kanan header (to-blue-600) */}
        <Card className="border-none shadow-xl bg-white/70 backdrop-blur-md overflow-hidden rounded-3xl ring-1 ring-white/60">
          <CardHeader className="bg-linear-to-r from-blue-50 to-transparent p-6 border-b border-blue-50">
            <CardTitle className="flex items-center gap-2 text-blue-900 text-lg">
              <Activity className="w-5 h-5 text-blue-600" /> Log Mood Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-blue-50/30">
                <TableRow className="hover:bg-transparent border-blue-100">
                  <TableHead className="w-[140px] font-bold text-blue-800 pl-6">Waktu</TableHead>
                  <TableHead className="font-bold text-blue-800 text-center">Mood</TableHead>
                  <TableHead className="font-bold text-blue-800">Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {moodLogs?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-32 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-2xl">💤</span>
                        Belum ada data mood.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  moodLogs?.map(log => (
                    <TableRow key={log.id} className="hover:bg-blue-50/40 transition-colors border-blue-50">
                      <TableCell className="font-medium text-xs text-gray-600 pl-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800">
                            {format(new Date(log.created_at), "dd MMM", { locale: id })}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {format(new Date(log.created_at), "HH:mm", { locale: id })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-2xl">
                        <div className="hover:scale-110 transition-transform cursor-default inline-block">
                          {log.mood === "senang" && "😄"}
                          {log.mood === "netral" && "😐"}
                          {log.mood === "sedih" && "😢"}
                          {log.mood === "lelah" && "😫"}
                          {log.mood === "marah" && "😡"}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 truncate max-w-[150px] italic">
                        <NoteDialog
                          note={log.note}
                          date={format(new Date(log.created_at), "dd MMM HH:mm", { locale: id })}
                          moodEmoji={
                            log.mood === "senang"
                              ? "😄"
                              : log.mood === "netral"
                              ? "😐"
                              : log.mood === "sedih"
                              ? "😢"
                              : log.mood === "lelah"
                              ? "😫"
                              : "😡"
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* === TABEL 2: RIWAYAT DASS (Tema: Indigo) === */}
        {/* SEKARANG SUDAH MATCH DENGAN HEADER KIRI (from-indigo-600) */}
        <Card className="border-none shadow-xl bg-white/70 backdrop-blur-md overflow-hidden rounded-3xl ring-1 ring-white/60">
          <CardHeader className="bg-linear-to-r from-indigo-50 to-transparent p-6 border-b border-indigo-50">
            <CardTitle className="flex items-center gap-2 text-indigo-900 text-lg">
              <LayoutList className="w-5 h-5 text-indigo-600" /> Hasil Tes Lengkap (DASS-21)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-indigo-50/30">
                <TableRow className="hover:bg-transparent border-indigo-100">
                  <TableHead className="w-[120px] font-bold text-indigo-800 pl-6 align-top pt-4">Tanggal</TableHead>
                  <TableHead className="font-bold text-indigo-800 align-top pt-4">Rincian Skor (S - A - D)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dassLogs?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="h-32 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-2xl">📝</span>
                        Belum ada riwayat tes.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  dassLogs?.map(test => (
                    <TableRow key={test.id} className="hover:bg-indigo-50/40 transition-colors border-indigo-50">
                      {/* Kolom Tanggal */}
                      <TableCell className="font-medium text-xs text-gray-600 pl-6 align-top py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800">
                            {format(new Date(test.created_at), "dd MMM", { locale: id })}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {format(new Date(test.created_at), "HH:mm", { locale: id })}
                          </span>
                        </div>
                      </TableCell>

                      {/* Kolom Hasil */}
                      <TableCell className="py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {/* 1. STRESS */}
                          <div
                            className={`flex flex-col items-start p-3 rounded-xl border ${getSeverityStyle(
                              test.level_stress
                            )}`}
                          >
                            <span className="text-[10px] uppercase font-extrabold opacity-70">Stress</span>
                            <div className="flex items-baseline gap-1 mt-1">
                              <span className="text-xl font-bold">{test.stress_score}</span>
                              <span className="text-[10px] capitalize font-medium opacity-90">
                                ({test.level_stress})
                              </span>
                            </div>
                          </div>

                          {/* 2. ANXIETY */}
                          <div
                            className={`flex flex-col items-start p-3 rounded-xl border ${getSeverityStyle(
                              test.level_anxiety
                            )}`}
                          >
                            <span className="text-[10px] uppercase font-extrabold opacity-70">Cemas</span>
                            <div className="flex items-baseline gap-1 mt-1">
                              <span className="text-xl font-bold">{test.anxiety_score}</span>
                              <span className="text-[10px] capitalize font-medium opacity-90">
                                ({test.level_anxiety})
                              </span>
                            </div>
                          </div>

                          {/* 3. DEPRESSION */}
                          <div
                            className={`flex flex-col items-start p-3 rounded-xl border ${getSeverityStyle(
                              test.level_depression
                            )}`}
                          >
                            <span className="text-[10px] uppercase font-extrabold opacity-70">Depresi</span>
                            <div className="flex items-baseline gap-1 mt-1">
                              <span className="text-xl font-bold">{test.depression_score}</span>
                              <span className="text-[10px] capitalize font-medium opacity-90">
                                ({test.level_depression})
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

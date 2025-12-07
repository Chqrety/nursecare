import { createClient } from "@/utils/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { id } from "date-fns/locale";

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
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Riwayat Kesehatan</h2>
        <p className="text-gray-500">Jejak perjalanan kesehatan mentalmu.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* === TABEL 1: RIWAYAT MOOD === */}
        <Card>
          <CardHeader>
            <CardTitle>Log Mood Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Mood</TableHead>
                  <TableHead>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {moodLogs?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-400">
                      Belum ada data mood.
                    </TableCell>
                  </TableRow>
                ) : (
                  moodLogs?.map(log => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium text-xs">
                        {format(new Date(log.created_at), "dd MMM HH:mm", { locale: id })}
                      </TableCell>
                      <TableCell>
                        {log.mood === "senang" && "😄"}
                        {log.mood === "netral" && "😐"}
                        {log.mood === "sedih" && "😢"}
                        {log.mood === "lelah" && "😫"}
                        {log.mood === "marah" && "😡"}
                      </TableCell>
                      <TableCell className="text-xs text-gray-500 truncate max-w-[100px]">{log.note || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* === TABEL 2: RIWAYAT DASS === */}
        <Card>
          <CardHeader>
            <CardTitle>Hasil Tes Stress (DASS-21)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Skor Stress</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dassLogs?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-400">
                      Belum ada riwayat tes.
                    </TableCell>
                  </TableRow>
                ) : (
                  dassLogs?.map(test => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium text-xs">
                        {format(new Date(test.created_at), "dd MMM HH:mm", { locale: id })}
                      </TableCell>
                      <TableCell>
                        <span className="font-bold">{test.stress_score}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            test.level_stress === "normal"
                              ? "default"
                              : test.level_stress === "mild"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {test.level_stress}
                        </Badge>
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

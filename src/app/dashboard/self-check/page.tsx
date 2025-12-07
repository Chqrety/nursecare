"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { dassQuestions, calculateScore } from "@/constants/dass";
import { Smile, Frown, Meh, Angry, BatteryWarning } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter, // <-- Tambah ini
} from "@/components/ui/dialog";

const copingMessages = {
  normal: "Keren! Pertahankan keseimbangan hidupmu. Jangan lupa reward diri sendiri ya! 🌸",
  mild: "Kamu baik-baik saja, mungkin butuh sedikit 'me time'. Coba teh hangat? 🍵",
  moderate: "Hari yang berat ya? Gapapa, kamu sudah berjuang hebat. Tarik napas panjang... 🍃",
  severe: "Hei, kamu tidak sendirian. Istirahatlah sejenak, dunia gak akan runtuh kalau kamu berhenti sebentar. 🫂",
};

export default function SelfCheckPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // --- STATE MOOD ---
  const [mood, setMood] = useState<string>("");
  const [note, setNote] = useState("");

  // --- STATE DASS ---
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const [showResult, setShowResult] = useState(false);
  const [resultMessage, setResultMessage] = useState({ title: "", msg: "" });

  // HANDLER: Submit Mood
  const submitMood = async () => {
    if (!mood) return toast.error("Pilih emoji dulu dong!");
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("mood_logs").insert({
      user_id: user.id,
      mood,
      note,
    });

    setLoading(false);
    if (error) {
      toast.error("Gagal simpan mood");
    } else {
      toast.success("Mood tercatat! Istirahat ya 🌷");
      setMood("");
      setNote("");
      router.refresh();
    }
  };

  // HANDLER: Submit DASS
  const submitDASS = async () => {
    if (Object.keys(answers).length < 21) {
      return toast.warning("Isi semua 21 pertanyaan dulu ya!");
    }
    setLoading(true);

    const scores = calculateScore(answers);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Tentukan Level Tertinggi (Simple logic: ambil score max dari 3 kategori)
    const maxScore = Math.max(scores.stress, scores.anxiety, scores.depression);

    // Tentukan Kategori Pesan (Logic sederhana)
    let level: "normal" | "mild" | "moderate" | "severe" = "normal";
    if (maxScore > 20) level = "severe";
    else if (maxScore > 14) level = "moderate";
    else if (maxScore > 9) level = "mild";

    // Simpan ke DB
    const { error } = await supabase.from("dass_assessments").insert({
      user_id: user?.id,
      stress_score: scores.stress,
      anxiety_score: scores.anxiety,
      depression_score: scores.depression,
      level_stress: level, // Simplifikasi buat demo
      level_anxiety: level,
      level_depression: level,
    });

    setLoading(false);

    if (error) {
      toast.error("Gagal submit tes.");
    } else {
      // 5. MUNCULKAN POPUP HASIL
      setResultMessage({
        title: `Hasil: Tingkat Stres ${level.charAt(0).toUpperCase() + level.slice(1)}`,
        msg: copingMessages[level],
      });
      setShowResult(true); // Trigger Dialog MUNCUL
      setAnswers({});
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Cek Kondisi Diri</h1>

      <Tabs defaultValue="mood" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mood">Mood Harian</TabsTrigger>
          <TabsTrigger value="dass">Tes Stress (DASS-21)</TabsTrigger>
        </TabsList>

        {/* === TAB 1: MOOD CHECK === */}
        <TabsContent value="mood">
          <Card>
            <CardHeader>
              <CardTitle>Apa yang kamu rasakan sekarang?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between gap-2">
                {[
                  { val: "senang", icon: Smile, color: "text-green-500", label: "Senang" },
                  { val: "netral", icon: Meh, color: "text-gray-500", label: "Biasa" },
                  { val: "sedih", icon: Frown, color: "text-blue-500", label: "Sedih" },
                  { val: "lelah", icon: BatteryWarning, color: "text-orange-500", label: "Lelah" },
                  { val: "marah", icon: Angry, color: "text-red-500", label: "Marah" },
                ].map(item => (
                  <button
                    key={item.val}
                    onClick={() => setMood(item.val)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      mood === item.val ? "border-blue-600 bg-blue-50" : "border-transparent hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className={`w-10 h-10 ${item.color}`} />
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Catatan Kecil (Opsional)</Label>
                <Textarea
                  placeholder="Ceritain dikit dong kenapa..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                />
              </div>

              <Button onClick={submitMood} disabled={loading} className="w-full">
                {loading ? "Menyimpan..." : "Simpan Mood"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === TAB 2: DASS TEST === */}
        <TabsContent value="dass">
          <Card>
            <CardHeader>
              <CardTitle>DASS-21 Assessment</CardTitle>
              <CardDescription>
                Pilih angka 0-3 yang paling sesuai dengan kondisimu seminggu terakhir.
                <br />
                0: Tidak sesuai | 1: Kadang-kadang | 2: Sering | 3: Sangat Sering
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {dassQuestions.map((q, index) => (
                <div key={q.id} className="space-y-3 border-b pb-4 last:border-0">
                  <p className="font-medium text-gray-800">
                    {index + 1}. {q.text}
                  </p>
                  <div className="flex gap-4 justify-between sm:justify-start">
                    {[0, 1, 2, 3].map(score => (
                      <label key={score} className="flex flex-col items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          className="w-5 h-5 accent-blue-600 mb-1"
                          checked={answers[q.id] === score}
                          onChange={() => setAnswers({ ...answers, [q.id]: score })}
                        />
                        <span className="text-sm text-gray-500">{score}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <Button onClick={submitDASS} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700">
                {loading ? "Menghitung..." : "Lihat Hasil"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-center text-blue-700">{resultMessage.title}</DialogTitle>
            <DialogDescription className="text-center text-lg mt-4 font-medium text-gray-700 italic">
              "{resultMessage.msg}"
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button type="button" variant="secondary" onClick={() => setShowResult(false)}>
              Siap, Lanjut Berjuang! 💪
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

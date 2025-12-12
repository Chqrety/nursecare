"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { dassQuestions, calculateScore } from "@/constants/dass";
import { Smile, Frown, Meh, Angry, BatteryWarning, CheckCircle, Phone, Activity } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

// Quote Database
const quotes = [
  "Kamu melakukan yang terbaik hari ini. Bangga padamu! 🌟",
  "Tarik napas... Hembuskan... Satu masalah per satu waktu. 🍃",
  "Istirahat itu produktif. Jangan merasa bersalah ya. 🛌",
  "Dunia butuh senyummu, tapi kamu butuh bahagiamu. 😊",
];

export default function SelfCheckPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // States
  const [mood, setMood] = useState<string>("");
  const [note, setNote] = useState("");
  const [answers, setAnswers] = useState<Record<number, number>>({});

  // Logic 1x Sehari
  const [hasFilledMood, setHasFilledMood] = useState(false);
  const [hasFilledDASS, setHasFilledDASS] = useState(false);

  // Dialog States
  const [showMoodResult, setShowMoodResult] = useState(false);
  const [moodQuote, setMoodQuote] = useState("");

  const [showDassResult, setShowDassResult] = useState(false);
  const [dassResult, setDassResult] = useState<any>(null);

  // 1. CEK DATA HARI INI SAAT LOAD
  useEffect(() => {
    const checkTodayLog = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD

      // Cek Mood Hari Ini
      const { data: moods } = await supabase
        .from("mood_logs")
        .select("created_at")
        .eq("user_id", user.id)
        .gte("created_at", `${today}T00:00:00`)
        .lte("created_at", `${today}T23:59:59`);

      if (moods && moods.length > 0) setHasFilledMood(true);

      // Cek DASS Hari Ini
      const { data: dass } = await supabase
        .from("dass_assessments")
        .select("created_at")
        .eq("user_id", user.id)
        .gte("created_at", `${today}T00:00:00`)
        .lte("created_at", `${today}T23:59:59`);

      if (dass && dass.length > 0) setHasFilledDASS(true);
    };

    checkTodayLog();
  }, []);

  // --- SUBMIT MOOD ---
  const submitMood = async () => {
    if (!mood) return toast.error("Pilih emoji dulu dong!");
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("mood_logs").insert({
      user_id: user?.id,
      mood,
      note,
    });

    setLoading(false);
    if (error) {
      toast.error("Gagal simpan mood");
    } else {
      setHasFilledMood(true);
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setMoodQuote(randomQuote);
      setShowMoodResult(true);
    }
  };

  // --- SUBMIT DASS (UPDATE LOGIC DISINI) ---
  const submitDASS = async () => {
    if (Object.keys(answers).length < 21) {
      return toast.warning("Isi semua 21 pertanyaan dulu ya!");
    }
    setLoading(true);
    const scores = calculateScore(answers);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Logic Level Simple (>14 itu Moderate ke atas)
    const getLevel = (val: number) => (val > 20 ? "severe" : val > 14 ? "moderate" : val > 9 ? "mild" : "normal");

    // Logic Dominant Issue
    const maxScore = Math.max(scores.stress, scores.anxiety, scores.depression);
    let dominantIssue = "general";
    if (scores.stress === maxScore) dominantIssue = "stress";
    if (scores.anxiety === maxScore) dominantIssue = "anxiety";
    if (scores.depression === maxScore) dominantIssue = "depression";

    // Logic High Risk (Kalau ada salah satu yang Moderate/Severe)
    const isHighRisk = scores.stress > 14 || scores.anxiety > 14 || scores.depression > 14;

    const { error } = await supabase.from("dass_assessments").insert({
      user_id: user?.id,
      stress_score: scores.stress,
      anxiety_score: scores.anxiety,
      depression_score: scores.depression,
      level_stress: getLevel(scores.stress),
      level_anxiety: getLevel(scores.anxiety),
      level_depression: getLevel(scores.depression),
    });

    setLoading(false);
    if (error) {
      toast.error("Gagal submit tes.");
    } else {
      setHasFilledDASS(true);
      setDassResult({ scores, dominantIssue, isHighRisk }); // Simpan status High Risk
      setShowDassResult(true);
    }
  };

  // Helper Visual Bar (Versi Warna Custom)
  const VisualBar = ({
    label,
    score,
    max = 42,
    colorName,
  }: {
    label: string;
    score: number;
    max?: number;
    colorName: string;
  }) => {
    const percentage = Math.min((score / max) * 100, 100);

    // Lookup Style Manual (Biar Tailwind Baca)
    const styles: Record<string, { text: string; bar: string; track: string }> = {
      red: { text: "text-red-800", bar: "bg-red-800", track: "bg-red-200" },
      yellow: { text: "text-yellow-800", bar: "bg-yellow-800", track: "bg-yellow-200" },
      blue: { text: "text-blue-800", bar: "bg-blue-800", track: "bg-blue-200" },
    };

    const currentStyle = styles[colorName] || styles.red;

    return (
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-gray-700">{label}</span>
          <span className={`font-bold ${currentStyle.text}`}>
            {score} / {max}
          </span>
        </div>
        <div className={`h-3 w-full overflow-hidden rounded-full ${currentStyle.track}`}>
          <div
            className={`h-full ${currentStyle.bar} transition-all duration-500 ease-in-out rounded-full`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 uppercase font-medium">
          <span>Normal</span>
          <span>Parah</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 to-cyan-600 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-200" />
            Cek Kondisi Diri
          </h1>
          <p className="mt-2 text-blue-100 max-w-2xl">
            Luangkan waktu sejenak untuk mendengarkan tubuh dan pikiranmu. Satu hari, satu kali cek. Konsistensi adalah
            kunci!
          </p>
        </div>

        {/* Dekorasi Background (Sama kayak Community Page) */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
      </div>

      <Tabs defaultValue="mood" className="w-full mt-8">
        <TabsList className="grid w-full grid-cols-2 p-1 bg-white/50 backdrop-blur rounded-2xl border border-white/40 mb-8 h-14">
          <TabsTrigger
            value="mood"
            className="rounded-xl h-12 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 font-bold transition-all"
          >
            Mood Harian
          </TabsTrigger>
          <TabsTrigger
            value="dass"
            className="rounded-xl h-12 data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-700 font-bold transition-all"
          >
            Tes Stress (DASS)
          </TabsTrigger>
        </TabsList>

        {/* === TAB MOOD === */}
        <TabsContent value="mood">
          <Card className="border-none shadow-xl bg-white/70 backdrop-blur-md rounded-3xl overflow-hidden">
            <CardHeader className="bg-linear-to-r from-blue-50 to-transparent p-8">
              <CardTitle className="text-2xl text-blue-900">
                {hasFilledMood ? "Mood hari ini sudah tercatat! ✅" : "Apa yang kamu rasakan sekarang?"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {!hasFilledMood ? (
                <>
                  <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
                    {[
                      { val: "senang", icon: Smile, color: "text-green-500", bg: "bg-green-100", label: "Happy" },
                      { val: "netral", icon: Meh, color: "text-gray-500", bg: "bg-gray-100", label: "Biasa" },
                      { val: "sedih", icon: Frown, color: "text-blue-500", bg: "bg-blue-100", label: "Sedih" },
                      {
                        val: "lelah",
                        icon: BatteryWarning,
                        color: "text-orange-500",
                        bg: "bg-orange-100",
                        label: "Lelah",
                      },
                      { val: "marah", icon: Angry, color: "text-red-500", bg: "bg-red-100", label: "Marah" },
                    ].map(item => (
                      <button
                        key={item.val}
                        onClick={() => setMood(item.val)}
                        className={`group flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${
                          mood === item.val
                            ? "bg-white shadow-lg scale-110 ring-4 ring-blue-100"
                            : "hover:bg-white/50 hover:scale-105"
                        }`}
                      >
                        <div
                          className={`p-4 rounded-full ${item.bg} ${item.color} group-hover:rotate-6 transition-transform`}
                        >
                          <item.icon className="w-10 h-10" />
                        </div>
                        <span className={`text-sm font-bold ${mood === item.val ? "text-gray-800" : "text-gray-500"}`}>
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <Label>Catatan Kecil</Label>
                    <Textarea
                      placeholder="Cerita dikit dong..."
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      className="bg-white/50 border-gray-200 rounded-xl"
                    />
                  </div>
                  <Button
                    onClick={submitMood}
                    disabled={loading}
                    className="w-full h-12 rounded-xl text-lg font-bold bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? "Menyimpan..." : "Simpan Mood"}
                  </Button>
                </>
              ) : (
                <div className="text-center py-10">
                  <div className="mx-auto bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Kamu sudah check-in hari ini!</h3>
                  <p className="text-gray-500 mt-2">Kembali lagi besok ya untuk pantau moodmu.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* === TAB DASS === */}
        <TabsContent value="dass">
          <Card className="border-none shadow-xl bg-white/70 backdrop-blur-md rounded-3xl">
            <CardContent className="p-8 space-y-8">
              {!hasFilledDASS ? (
                <>
                  <div className="space-y-4">
                    {dassQuestions.map((q, index) => (
                      <div key={q.id} className="space-y-3 border-b border-gray-200/50 pb-4 last:border-0">
                        <p className="font-medium text-gray-800">
                          {index + 1}. {q.text}
                        </p>
                        <div className="flex gap-4">
                          {[0, 1, 2, 3].map(score => (
                            <label key={score} className="flex flex-col items-center cursor-pointer">
                              <input
                                type="radio"
                                name={`q-${q.id}`}
                                className="w-5 h-5 accent-cyan-600 mb-1"
                                checked={answers[q.id] === score}
                                onChange={() => setAnswers({ ...answers, [q.id]: score })}
                              />
                              <span className="text-sm text-gray-500">{score}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={submitDASS}
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-cyan-600 hover:bg-cyan-700 font-bold"
                  >
                    {loading ? "Menghitung..." : "Lihat Hasil"}
                  </Button>
                </>
              ) : (
                <div className="text-center py-10">
                  <h3 className="text-xl font-bold text-gray-800">Tes Hari Ini Selesai</h3>
                  <p className="text-gray-500">Hasil tesmu sudah tersimpan di riwayat.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* === DIALOG 1: MOOD QUOTE === */}
      <Dialog open={showMoodResult} onOpenChange={setShowMoodResult}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">✨ Daily Reminder ✨</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <p className="text-lg font-medium italic text-gray-700">"{moodQuote}"</p>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button onClick={() => setShowMoodResult(false)} className="bg-blue-600">
              Terima Kasih
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* === DIALOG 2: HASIL DASS VISUAL (LOGIC REDIRECT UPDATE) === */}
      <Dialog open={showDassResult} onOpenChange={setShowDassResult}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-cyan-900">Hasil Analisa Kamu</DialogTitle>
            <DialogDescription className="text-center">
              Berikut adalah tingkat stress, cemas, dan depresimu.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-6">
            {dassResult && (
              <>
                <VisualBar label="Tingkat Stress" score={dassResult.scores.stress} colorName="red" />
                <VisualBar label="Tingkat Kecemasan" score={dassResult.scores.anxiety} colorName="yellow" />
                <VisualBar label="Tingkat Depresi" score={dassResult.scores.depression} colorName="blue" />
              </>
            )}
          </div>

          <DialogFooter className="flex flex-col gap-3">
            {/* LOGIC TOMBOL PINTAR */}
            {dassResult?.isHighRisk ? (
              // KONDISI 1: Kalau Stress Tinggi -> Prioritas ke Konsultasi
              <div className="w-full space-y-2">
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100 text-center mb-2">
                  ⚠️ Skor kamu cukup tinggi. Kami sarankan bicara dengan profesional.
                </div>
                <Button
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold h-11"
                  onClick={() => router.push("/dashboard/consultation")}
                >
                  <Phone className="w-4 h-4 mr-2" /> Cari Bantuan Profesional
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/dashboard/educare?filter=${dassResult?.dominantIssue}`)}
                >
                  📖 Baca Artikel Dulu
                </Button>
              </div>
            ) : (
              // KONDISI 2: Kalau Aman -> Ke Educare Aja
              <Button
                className="w-full bg-cyan-600 hover:bg-cyan-700 h-11"
                onClick={() => router.push(`/dashboard/educare?filter=${dassResult?.dominantIssue}`)}
              >
                📖 Baca Solusi & Edukasi ({dassResult?.dominantIssue})
              </Button>
            )}

            <Button variant="ghost" onClick={() => setShowDassResult(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

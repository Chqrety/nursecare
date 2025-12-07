"use client";

import { useActionState } from "react"; // atau useFormState di Next.js versi lama
import { createArticle } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useEffect } from "react";
import { AlignLeft, ImageIcon, Layers, PenLine, Type } from "lucide-react";

const initialState = {
  message: "",
  status: "",
};

export function CreateArticleForm() {
  // Hook buat nge-bind Server Action ke Form React
  const [state, formAction, isPending] = useActionState(createArticle, initialState);

  // Efek buat munculin notifikasi (Toast) pas selesai submit
  useEffect(() => {
    if (state?.status === "success") {
      toast.success(state.message);
      // Reset form manual (simple way)
      (document.getElementById("article-form") as HTMLFormElement)?.reset();
    } else if (state?.status === "error") {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Card className="mt-8 border-none shadow-xl bg-white/80 backdrop-blur-sm ring-1 ring-slate-200/50 rounded-2xl overflow-hidden">
      {/* Header Form dengan Background Soft */}
      <CardHeader className="bg-linear-to-r from-rose-50 to-white border-b border-rose-100 p-6">
        <CardTitle className="flex items-center gap-2 text-rose-700 text-xl">
          <div className="p-2 bg-rose-100 rounded-lg">
            <PenLine className="w-5 h-5" />
          </div>
          Tulis Artikel Baru
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8">
        <form id="article-form" action={formAction} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Judul */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-600 font-semibold flex items-center gap-2">
                <Type className="w-4 h-4 text-slate-400" /> Judul Artikel
              </Label>
              <Input
                name="title"
                placeholder="Contoh: Cara Mengatasi Burnout"
                required
                className="h-12 bg-slate-50 border-slate-200 focus:border-rose-500 focus:ring-rose-200 rounded-xl transition-all"
              />
            </div>

            {/* Input Kategori */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-slate-600 font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-400" /> Kategori
              </Label>
              <Input
                name="category"
                placeholder="Tips / Motivasi / Kesehatan"
                required
                className="h-12 bg-slate-50 border-slate-200 focus:border-rose-500 focus:ring-rose-200 rounded-xl transition-all"
              />
            </div>
          </div>

          {/* Input Gambar */}
          <div className="space-y-2">
            <Label htmlFor="image_url" className="text-slate-600 font-semibold flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-400" /> Link Gambar (URL)
            </Label>
            <Input
              name="image_url"
              placeholder="https://..."
              className="h-12 bg-slate-50 border-slate-200 focus:border-rose-500 focus:ring-rose-200 rounded-xl transition-all"
            />
            <p className="text-[11px] text-slate-400 italic">
              *Tips: Gunakan link gambar dari Unsplash atau Pexels agar resolusi bagus.
            </p>
          </div>

          {/* Input Konten */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-slate-600 font-semibold flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-slate-400" /> Isi Konten
            </Label>
            <Textarea
              name="content"
              placeholder="Mulai menulis cerita inspiratifmu di sini..."
              className="min-h-[180px] bg-slate-50 border-slate-200 focus:border-rose-500 focus:ring-rose-200 rounded-xl p-4 leading-relaxed transition-all resize-y"
              required
            />
          </div>

          {/* Tombol Submit */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-linear-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-200 transition-all hover:scale-[1.01]"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Sedang Menerbitkan...
              </span>
            ) : (
              "🚀 Terbitkan Artikel"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowUpRight, Calendar, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"

export function ArticleCard({ article }: { article: any }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Card
        onClick={() => setIsOpen(true)}
        className="group py-0 flex flex-col h-full bg-white border-emerald-100/50 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-1 transition-all duration-300 rounded-3xl overflow-hidden cursor-pointer"
      >
        {/* Gambar Artikel dengan Overlay Gradient saat Hover */}
        <div className="relative h-52 w-full overflow-hidden bg-gray-100">
          <img
            src={article.image_url || "https://placehold.co/600x400"}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Overlay Gelap dikit pas hover biar teks putih kebaca (opsional) */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Badge Kategori Nempel di Gambar */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-white/90 text-emerald-700 hover:bg-white shadow-sm backdrop-blur-md border-emerald-100">
              {article.category}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-2">
          {/* Metadata Tanggal */}
          <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-2 font-medium">
            <Calendar className="w-3 h-3" />
            <span>
              {article.created_at
                ? formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: id })
                : "Baru saja"}
            </span>
          </div>

          <CardTitle className="text-xl font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
            {article.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="grow">
          <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">{article.content}</p>
        </CardContent>

        <CardFooter className="pt-0 pb-6">
          <div className="w-full flex items-center justify-between text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">
            <span>Baca Selengkapnya</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
        </CardFooter>
      </Card>

      {/* === POPUP BACA (LEBIH LEGA) === */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto p-0 rounded-3xl gap-0">
          {/* Gambar Header Full Width */}
          <div className="relative h-64 w-full bg-slate-100">
            <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

            {/* Judul di atas gambar (ala Medium/Blog modern) */}
            <div className="absolute bottom-0 left-0 p-6 text-white w-full">
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none mb-3">
                {article.category}
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold leading-tight shadow-black drop-shadow-md">
                {article.title}
              </h2>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Info Penulis/Waktu */}
            <div className="flex items-center gap-4 text-xs text-slate-400 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(article.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />5 menit baca
              </div>
            </div>

            {/* Isi Konten */}
            <DialogDescription className="text-slate-600 text-base leading-relaxed whitespace-pre-wrap text-justify">
              {article.content}
            </DialogDescription>

            <Button onClick={() => setIsOpen(false)} variant="outline" className="w-full rounded-xl mt-4">
              Tutup Artikel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

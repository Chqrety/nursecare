"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area"; // Opsional, biar bisa scroll kalau panjang banget

interface NoteDialogProps {
  note: string | null;
  date: string; // Kita butuh tanggal buat judul dialog biar jelas
  moodEmoji: string;
}

export function NoteDialog({ note, date, moodEmoji }: NoteDialogProps) {
  // Kalau gak ada catatan, tampilin strip aja
  if (!note) return <span className="text-gray-400">-</span>;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Ini Tampilan di Tabel (Text Truncate) */}
        <div className="cursor-pointer group">
          <p className="truncate max-w-[200px] text-gray-600 italic group-hover:text-blue-600 transition-colors">
            "{note}"
          </p>
          <span className="text-[10px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
            (Klik untuk baca)
          </span>
        </div>
      </DialogTrigger>

      {/* Ini Isi Dialog Pas Dibuka */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{moodEmoji}</span>
            <span>Catatan Mood ({date})</span>
          </DialogTitle>
          <DialogDescription>Detail perasaan yang kamu tulis hari itu.</DialogDescription>
        </DialogHeader>

        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 italic text-gray-700 leading-relaxed text-lg">
          "{note}"
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, useEffect } from "react";

// Database Quotes
const quotes = [
  { text: "Merawat orang lain dimulai dari merawat diri sendiri.", icon: "🌻" },
  { text: "Istirahat bukan berarti berhenti, tapi mengisi ulang energi.", icon: "🔋" },
  { text: "Kamu manusia dulu, baru perawat. Jangan lupa makan.", icon: "🍱" },
  { text: "Tidak apa-apa merasa lelah, itu tanda kamu sedang berjuang.", icon: "💪" },
  { text: "Tarik napas dalam-dalam. Satu shift pada satu waktu.", icon: "🌬️" },
  { text: "Kesehatan mentalmu sama pentingnya dengan pasienmu.", icon: "🧠" },
  { text: "Menangis itu valid. Jangan ditahan kalau memang berat.", icon: "💧" },
  { text: "Kamu melakukan yang terbaik hari ini. Aku bangga padamu.", icon: "⭐" },
  { text: "Jangan bawa beban rumah sakit sampai ke bantal tidurmu.", icon: "🛌" },
  { text: "Dunia butuh senyummu, tapi kamu butuh bahagiamu.", icon: "😊" },
];

export function RandomQuote() {
  // State buat nyimpen quote yang lagi tampil
  const [quote, setQuote] = useState(quotes[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Logic Acak: Jalankan cuma SEKALI pas halaman dibuka/direload
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  // Cegah hydration mismatch (tunggu sampai mounted baru render yang acak)
  if (!mounted) return null;

  return (
    <div className="h-full rounded-2xl bg-linear-to-br from-orange-100 to-amber-50 p-6 shadow-sm border border-orange-100 flex flex-col justify-center items-center text-center hover:shadow-md transition-all duration-300">
      <span className="text-4xl mb-4 transform hover:scale-110 transition-transform cursor-default">{quote.icon}</span>

      <p className="text-gray-800 font-medium italic text-lg leading-relaxed animate-in fade-in duration-700">
        "{quote.text}"
      </p>

      <p className="text-xs text-orange-600/60 mt-4 font-semibold tracking-widest uppercase">Daily Reminder</p>
    </div>
  );
}

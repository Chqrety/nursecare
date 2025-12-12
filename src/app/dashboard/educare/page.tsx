import { createClient } from "@/utils/supabase/server";
import { ArticleCard } from "@/components/ArticleCard";
import { BookOpen } from "lucide-react";

export default async function EducarePage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const supabase = await createClient();

  // Fetch semua artikel
  // const { data: articles } = await supabase.from("articles").select("*").order("created_at", { ascending: false });

  const params = await searchParams; // Next.js 15 butuh await
  const filter = params?.filter; // Bisa 'stress', 'anxiety', 'depression', atau undefined

  // Logic Query: Kalau ada filter, cari artikel yang kategori-nya mirip
  let query = supabase.from("articles").select("*").order("created_at", { ascending: false });

  if (filter && filter !== "general") {
    // Asumsi di DB category-nya: 'Stress', 'Tips', 'Relaksasi'
    // Kita pakai ILIKE biar case-insensitive search
    // Misal user stress -> cari artikel yang ada kata 'Stress' atau 'Tips'
    if (filter === "stress") query = query.ilike("category", "%Stress%");
    if (filter === "anxiety") query = query.ilike("category", "%Cemas%");
    if (filter === "depression") query = query.ilike("category", "%Motivasi%");
  }

  const { data: articles } = await query;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-600 to-teal-600 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-emerald-200" />
            Educare
          </h1>
          <p className="mt-2 text-emerald-100 max-w-2xl">
            {filter
              ? `Menampilkan artikel rekomendasi khusus untuk: ${filter.toUpperCase()}`
              : "Perpusatakaan digital untuk perawat. Temukan tips praktis menjaga kewarasan dan kesehatan mentalmu di sini."}
          </p>
        </div>

        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles?.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

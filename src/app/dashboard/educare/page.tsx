import { createClient } from "@/utils/supabase/server";
import { ArticleCard } from "@/components/ArticleCard";

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
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-green-700">Educare</h2>
        <p className="text-gray-500">
          {filter
            ? `Menampilkan artikel rekomendasi untuk: ${filter.toUpperCase()}`
            : "Kumpulan artikel dan tips untuk menjaga kewarasanmu."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles?.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

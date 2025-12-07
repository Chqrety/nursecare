import { createClient } from "@/utils/supabase/server";
import { ArticleCard } from "@/components/ArticleCard";

export default async function EducarePage() {
  const supabase = await createClient();

  // Fetch semua artikel
  const { data: articles } = await supabase.from("articles").select("*").order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-green-700">Educare 📚</h2>
        <p className="text-gray-500">Kumpulan artikel dan tips untuk menjaga kewarasanmu.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles?.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

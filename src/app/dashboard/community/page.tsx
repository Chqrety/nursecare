import { createClient } from "@/utils/supabase/server";
import { Users, Sparkles } from "lucide-react";
import { CommunityPostForm } from "@/components/CommunityPostForm";
import { CommunityPostItem } from "@/components/CommunityPostItem";

export const dynamic = "force-dynamic"; // Wajib biar data selalu fresh tiap refresh

export default async function CommunityPage() {
  const supabase = await createClient();

  // 1. Ambil User yang sedang login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Fetch Postingan (Join dengan Comments & Likes)
  const { data: posts, error } = await supabase
    .from("community_posts")
    .select(
      `
      *,
      community_comments (
        id,
        comment_text,
        anon_id,
        created_at
      ),
      community_likes (
        user_id
      )
    `
    )
    .order("created_at", { ascending: false }); // Urutkan dari yang terbaru

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Header Halaman */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-purple-600 to-indigo-600 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-200" />
            Sharing Session
          </h1>
          <p className="mt-2 text-purple-100 max-w-2xl">
            Ruang aman untuk berbagi cerita, keluh kesah, atau momen bahagia sesama perawat. Identitasmu disamarkan
            secara otomatis (Anonim).
          </p>
        </div>
        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KOLOM KIRI: Form Input (Sticky biar tetep keliatan pas scroll) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <CommunityPostForm />

            {/* Info Box Kecil */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-700">
              <p className="font-bold flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4" /> Tips Komunitas
              </p>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>Jaga sopan santun.</li>
                <li>Dilarang menyebut nama pasien/RS (Privasi).</li>
                <li>Saling dukung, jangan menghakimi.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Feed Postingan */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
            Feed Terbaru
            <span className="text-xs font-normal px-2 py-1 bg-slate-100 rounded-full text-slate-500">
              {posts?.length || 0} Cerita
            </span>
          </h2>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
              Gagal memuat data: {error.message}
            </div>
          )}

          {posts?.length === 0 ? (
            <div className="py-12 text-center text-slate-400 bg-white/50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-lg">Belum ada cerita yang dibagikan.</p>
              <p className="text-sm">Jadilah yang pertama menulis di sini!</p>
            </div>
          ) : (
            posts?.map((post: any) => (
              <CommunityPostItem
                key={post.id}
                post={post}
                currentUserId={user?.id} // Penting buat logic like/unlike
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

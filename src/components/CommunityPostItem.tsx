"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { id as indonesia } from "date-fns/locale";
import { Heart, MessageCircle, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toggleLike, addComment } from "@/app/dashboard/community/actions";
import { toast } from "sonner";

export function CommunityPostItem({ post, currentUserId }: { post: any; currentUserId?: string }) {
  // State untuk interaksi lokal
  const [isLiked, setIsLiked] = useState(post.community_likes?.some((like: any) => like.user_id === currentUserId));
  const [likeCount, setLikeCount] = useState(post.community_likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  // Handler Like
  const handleLike = async () => {
    // Optimistic Update (Ubah UI duluan biar kerasa cepet)
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikeCount((prev: number) => (newIsLiked ? prev + 1 : prev - 1));

    // Kirim ke Server
    await toggleLike(post.id);
  };

  // Handler Comment
  const handleCommentSubmit = async (formData: FormData) => {
    const text = formData.get("comment");
    if (!text) return;

    setCommentLoading(true);
    await addComment(post.id, text as string);
    setCommentLoading(false);

    // Reset input manual
    (document.getElementById(`comment-form-${post.id}`) as HTMLFormElement)?.reset();
    toast.success("Komentar terkirim!");
  };

  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-white/60 backdrop-blur-sm">
      {/* HEADER: Identitas Anonim */}
      <CardHeader className="flex flex-row items-center gap-3 p-4 pb-2">
        <Avatar className="h-10 w-10 border border-purple-100">
          <AvatarFallback className="bg-purple-50 text-purple-700 text-xs font-bold">
            #{post.anon_id || "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-700">Perawat Anonim #{post.anon_id}</span>
          <span className="text-[10px] text-slate-400">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: indonesia })}
          </span>
        </div>
      </CardHeader>

      {/* CONTENT: Judul & Isi */}
      <CardContent className="p-4 pt-2 space-y-2">
        <h3 className="font-bold text-lg text-slate-800 leading-tight">{post.title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
      </CardContent>

      {/* FOOTER: Tombol Aksi */}
      <CardFooter className="p-4 pt-0 flex flex-col items-start gap-4">
        {/* Tombol Like & Comment Toggle */}
        <div className="flex items-center gap-4 w-full border-t border-slate-100 pt-3">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 ${isLiked ? "text-rose-600 bg-rose-50" : "text-slate-500 hover:text-rose-500"}`}
            onClick={handleLike}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            <span className="text-xs">{likeCount} Suka</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-slate-500 hover:text-blue-500"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs">{post.community_comments?.length || 0} Komentar</span>
          </Button>
        </div>

        {/* SECTION KOMENTAR (Hidden by default) */}
        {showComments && (
          <div className="w-full space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 bg-slate-50/50 p-4 rounded-xl">
            {/* List Komentar */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {post.community_comments?.length === 0 ? (
                <p className="text-xs text-center text-slate-400 py-2">Belum ada komentar. Jadilah yang pertama!</p>
              ) : (
                post.community_comments?.map((comment: any) => (
                  <div key={comment.id} className="flex gap-2 items-start text-sm">
                    <div className="min-w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                      #{comment.anon_id}
                    </div>
                    <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm border border-slate-100 flex-1">
                      <p className="text-slate-700">{comment.comment_text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Komentar Baru */}
            <form id={`comment-form-${post.id}`} action={handleCommentSubmit} className="flex gap-2">
              <Input
                name="comment"
                placeholder="Tulis balasan yang mendukung..."
                className="h-9 text-sm bg-white"
                autoComplete="off"
              />
              <Button size="icon" className="h-9 w-9 bg-purple-600 hover:bg-purple-700" disabled={commentLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

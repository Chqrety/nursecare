"use client";

import { useState } from "react";
import { createPost } from "@/app/dashboard/community/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PenTool, Send } from "lucide-react";
import { toast } from "sonner";

export function CommunityPostForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Wajib: Mencegah refresh halaman

    if (loading) return;

    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    createPost(formData)
      .then(res => {
        if (res.status === "success") {
          toast.success(res.message);
          form.reset();
        } else {
          toast.error(res.message);
        }
      })
      .catch(() => {
        toast.error("Terjadi kesalahan jaringan.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // console.log(loading);

  return (
    <Card className="border-none shadow-md bg-white/80 backdrop-blur sticky top-24">
      <CardHeader className="bg-linear-to-r from-purple-50 to-transparent p-4 border-b border-purple-100">
        <CardTitle className="text-md flex items-center gap-2 text-purple-800">
          <PenTool className="w-4 h-4" /> Mulai Bercerita
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form id="post-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              name="title"
              placeholder="Judul menarik..."
              required
              className="bg-white border-purple-100 focus:border-purple-300"
            />
          </div>
          <div>
            <Textarea
              name="content"
              placeholder="Ceritakan pengalamanmu (Identitasmu aman, hanya muncul ID Anonim)..."
              className="min-h-[150px] bg-white border-purple-100 focus:border-purple-300 resize-none"
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 font-bold">
            {loading ? (
              "Mengirim..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" /> Kirim Cerita
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulse } from "lucide-react";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message: string }> }) {
  const params = await searchParams;

  // LOGIC LOGIN
  const login = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Gagal login: Cek email/password");
    }

    await supabase.rpc("increment_visits");

    return redirect("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor (Blob) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      {/* GLASS CARD */}
      <div className="w-full max-w-md bg-white/70 backdrop-blur-lg border border-white/50 rounded-3xl shadow-xl p-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-tr from-blue-500 to-purple-500 mb-4 shadow-lg shadow-blue-500/30">
            <HeartPulse className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Selamat Datang</h1>
          <p className="text-sm text-gray-500 mt-2">Masuk ke NurseCare untuk memulai.</p>
        </div>

        {/* Form */}
        <form action={login} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nama@rs.com"
              required
              className="bg-white/50 border-gray-200 focus:bg-white transition-all rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••"
              required
              className="bg-white/50 border-gray-200 focus:bg-white transition-all rounded-xl"
            />
          </div>

          {params?.message && (
            <div className="p-3 bg-red-100/80 border border-red-200 text-red-600 text-sm rounded-xl text-center">
              {params.message}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02]"
          >
            Masuk Sekarang
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-600 font-semibold hover:underline">
            Daftar Gratis
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link"
import { headers } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default async function RegisterPage(props: { searchParams: Promise<{ message: string }> }) {
  const searchParams = await props.searchParams

  // LOGIC REGISTER
  const signup = async (formData: FormData) => {
    "use server"

    const origin = (await headers()).get("origin")
    const fullName = formData.get("fullName") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          full_name: fullName, // Metadata ini akan otomatis masuk ke tabel profiles via Trigger SQL
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
        },
      },
    })

    if (error) {
      return redirect("/register?message=Gagal daftar. Coba email lain.")
    }

    // Redirect langsung
    return redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-600">Daftar NurseCare 🌱</CardTitle>
          <CardDescription>Bergabunglah dengan komunitas perawat sehat</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input id="fullName" name="fullName" type="text" placeholder="Siti Nurhaliza" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="perawat@contoh.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="••••••" required />
            </div>

            {searchParams?.message && (
              <p className="text-sm text-red-500 bg-red-50 p-2 rounded text-center border border-red-200">
                {searchParams.message}
              </p>
            )}

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Daftar Sekarang
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-green-600 hover:underline">
              Masuk di sini
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

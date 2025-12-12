import { createClient } from "@/utils/supabase/server";
import { Stethoscope, Phone, ExternalLink, UserRound, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function ConsultationPage() {
  const supabase = await createClient();

  // Fetch Kontak yang Aktif
  const { data: contacts } = await supabase
    .from("consultation_contacts")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Header Halaman (Gradient Teal) */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-teal-600 to-emerald-600 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Stethoscope className="w-8 h-8 text-teal-200" />
            Layanan Konsultasi
          </h1>
          <p className="mt-2 text-teal-100 max-w-2xl">
            Jangan ragu mencari bantuan profesional. Berikut adalah daftar psikolog, konselor, dan layanan dukungan yang
            siap mendengarkanmu.
          </p>
        </div>
        {/* Dekorasi Background */}
        <div className="absolute bottom-0 right-0 -mb-10 -mr-10 h-48 w-48 rounded-full bg-white/10 blur-3xl"></div>
      </div>

      {/* Grid Kontak */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts?.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white/50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-lg">Belum ada kontak yang tersedia saat ini.</p>
          </div>
        ) : (
          contacts?.map((contact: any) => (
            <Card
              key={contact.id}
              className="border-none shadow-sm hover:shadow-lg transition-all bg-white/80 backdrop-blur-sm flex flex-col"
            >
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div className="h-12 w-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100">
                  <UserRound className="w-6 h-6" />
                </div>
                <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                  {contact.category}
                </Badge>
              </CardHeader>

              <CardContent className="flex-1">
                <h3 className="text-lg font-bold text-slate-800">{contact.name}</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Siap membantu menangani burnout, stress kerja, dan masalah personal.
                </p>
              </CardContent>

              <CardFooter className="pt-2">
                <Link href={contact.contact_link} target="_blank" className="w-full">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold gap-2">
                    <Phone className="w-4 h-4" /> Hubungi Sekarang
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Info Box */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3 text-amber-800 text-sm">
        <span className="text-xl">💡</span>
        <div>
          <strong>Disclaimer:</strong> NurseCare hanya sebagai perantara informasi. Segala proses konseling dan
          transaksi terjadi di luar aplikasi ini (via WhatsApp/Platform Pihak Ketiga).
        </div>
      </div>
    </div>
  );
}

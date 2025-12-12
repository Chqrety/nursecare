import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const viewport: Viewport = {
  themeColor: "#0891b2", // Cyan-600 (Warna dominan aplikasi)
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  // Ganti URL ini dengan domain asli lu nanti (misal: https://nursecare.id)
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://nursecare-mu.vercel.app"),

  title: {
    default: "NurseCare - Sahabat Kesehatan Mental Perawat Indonesia",
    template: "%s | NurseCare", // Nanti child page jadi: "Dashboard | NurseCare"
  },

  description:
    "Platform kesehatan mental khusus untuk perawat. Pantau mood harian, cek tingkat stres (DASS-21), akses edukasi burnout, dan temukan dukungan komunitas sesama ners.",

  keywords: [
    "NurseCare",
    "Kesehatan Mental Perawat",
    "Burnout Perawat",
    "Tes DASS-21 Online",
    "Komunitas Perawat Indonesia",
    "Cek Stres Gratis",
    "Self Care Ners",
    "PPNI",
  ],

  authors: [{ name: "Tim NurseCare" }],
  creator: "NurseCare Team",
  publisher: "NurseCare",

  // Setup tampilan saat di-share ke WA/FB/LinkedIn
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://nursecare-mu.vercel.app",
    title: "NurseCare - Jaga Kewarasanmu, Ners!",
    description:
      "Aplikasi pantau mood dan cek stres khusus perawat. Gabung sekarang untuk akses fitur self-check dan komunitas.",
    siteName: "NurseCare",
    // images: [
    //   {
    //     url: "/og-image.png", // Bikin gambar ukuran 1200x630 simpan di folder public
    //     width: 1200,
    //     height: 630,
    //     alt: "NurseCare Dashboard Preview",
    //   },
    // ],
  },

  // Setup tampilan saat di-share ke Twitter/X
  twitter: {
    card: "summary_large_image",
    title: "NurseCare - Mental Health App for Nurses",
    description: "Pantau mood, cek stres, dan curhat anonim di NurseCare.",
    // images: ["/og-image.png"],
  },

  // Instruksi buat Google Bot
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Icon di Tab Browser
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={`${fontSans.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

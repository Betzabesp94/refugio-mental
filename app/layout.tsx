import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Refugio Mental — Apoyo psicológico gratuito · 24J Venezuela",
    template: "%s | Refugio Mental",
  },
  description:
    "Directorio comunitario gratuito que conecta psicólogos voluntarios con personas afectadas emocionalmente por el terremoto del 24 de junio de 2026 en Venezuela.",
  keywords: [
    "apoyo psicológico",
    "Venezuela",
    "terremoto 24J",
    "psicólogos voluntarios",
    "salud mental",
    "emergencia",
  ],
  openGraph: {
    title: "Refugio Mental — Apoyo psicológico gratuito · 24J Venezuela",
    description:
      "Conectamos psicólogos voluntarios con personas afectadas por el terremoto del 24J en Venezuela. Totalmente gratuito.",
    locale: "es_VE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

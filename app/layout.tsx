import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Oaureal | Sincroniza tu biología. Domina tu mente.",
    template: "%s | Oaureal",
  },
  description:
    "Entrenamiento cerebral con sonidos binaurales de precisión científica para regular tu sistema nervioso. Descubre tu protocolo personalizado.",
  keywords: [
    "entrenamiento cerebral",
    "sonidos binaurales",
    "brainwave entrainment",
    "regulación sistema nervioso",
    "meditación activa",
    "frecuencias cerebrales",
    "bienestar mental",
    "calma",
    "enfoque",
    "descanso profundo"
  ],
  authors: [{ name: "Oaureal Labs" }],
  creator: "Oaureal Labs",
  publisher: "Oaureal Labs",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://oaureal.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://oaureal.com",
    title: "Oaureal | Sincroniza tu biología. Domina tu mente.",
    description:
      "Entrenamiento cerebral con sonidos binaurales de precisión científica para regular tu sistema nervioso.",
    siteName: "Oaureal",
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-black">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

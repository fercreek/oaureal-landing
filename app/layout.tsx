import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Roboto, Cormorant_Garamond, Exo_2, Libre_Baskerville } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

const exo = Exo_2({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-exo",
});

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-libre-baskerville",
});

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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/logo-icon.png",
    apple: "/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`antialiased bg-bg ${roboto.variable} ${cormorant.variable} ${exo.variable} ${libreBaskerville.variable}`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}

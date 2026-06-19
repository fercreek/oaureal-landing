import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { Roboto, Cormorant_Garamond, Exo_2, Libre_Baskerville } from "next/font/google";
import { GoogleAnalytics } from "@/components/ui/GoogleAnalytics";
import { FAQ_ITEMS } from "@/lib/constants";
import "./globals.css";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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

const siteTitle = "Oaureal – Sonidos para dormir, calma y enfoque mental";
const siteDescription =
  "Audio binaural personalizado para regular tu sistema nervioso: dormir mejor, calmar la sobreestimulación y mejorar el enfoque.";

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: "%s | Oaureal",
  },
  description: siteDescription,
  keywords: [
    "entrenamiento cerebral",
    "sonidos binaurales",
    "brainwave entrainment",
    "regulación sistema nervioso",
    "neuro wellness",
    "sistema nervioso autónomo",
    "audio binaural personalizado",
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
    title: siteTitle,
    description: siteDescription,
    siteName: "Oaureal",
    images: [
      {
        url: "/logo-white.png",
        width: 1200,
        height: 630,
        alt: "Oaureal – Entrenamiento cerebral con binaurales",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/logo-white.png"],
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://oaureal.com/#website",
      url: "https://oaureal.com",
      name: "Oaureal",
      description: siteDescription,
      inLanguage: "es-MX",
      publisher: {
        "@id": "https://oaureal.com/#organization",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://oaureal.com/#organization",
      name: "Oaureal Labs",
      url: "https://oaureal.com",
      sameAs: [
        "https://www.instagram.com/oaureal",
        "https://www.tiktok.com/@oaureal",
        "https://youtube.com/@oaureal",
        "https://www.facebook.com/share/1AQSQWk4gq/",
      ],
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="sitemap" type="application/xml" href="https://oaureal.com/sitemap.xml" />
      </head>
      <body
        className={`antialiased bg-bg ${roboto.variable} ${cormorant.variable} ${exo.variable} ${libreBaskerville.variable}`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-config" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
            <GoogleAnalytics />
          </>
        )}
        {children}
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = "https://voltx.io";
const SITE_DESCRIPTION =
  "VOLTX is building the future of local experiences by helping students, communities, creators, and businesses discover opportunities, meet the right people, and transform digital interactions into meaningful real-world connections.";

export const metadata: Metadata = {
  title: {
    default: "VOLTX™",
    template: "%s | VOLTX™",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "VOLTX",
    "local experiences",
    "community",
    "networking",
    "technology",
    "startup",
    "connections",
    "students",
    "creators",
    "businesses",
  ],
  authors: [{ name: "Mehdi Majdi" }],
  creator: "VOLTX",
  publisher: "VOLTX",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "VOLTX™",
    title: "VOLTX® — Break The Limits",
    description:
      "Explore the world. Meet your people. Live the moment.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VOLTX® — Break The Limits",
    description:
      "Explore the world. Meet your people. Live the moment.",
    creator: "@voltx",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
};

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "VOLTX",
  alternateName: "VOLTX®",
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  founder: {
    "@type": "Person",
    name: "Mehdi Majdi",
    jobTitle: "Founder & CEO",
  },
  foundingDate: "2026",
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full bg-[#000000] text-white">{children}</body>
    </html>
  );
}
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
});

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

export const metadata: Metadata = {
  title: "VOLTX® — The Future of Local Experiences",
  description:
    "VOLTXsss is building the future of local experiences by helping students, communities, creators, and businesses discover opportunities, meet the right people, and transform digital interactions into meaningful real-world connections.",
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
  metadataBase: new URL("https://voltx.io"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://voltx.io",
    siteName: "VOLTX®",
    title: "VOLTX® — The Future of Local Experiences",
    description:
      " should bring people closer, not keep them apart. VOLTX is building the future of local experiences.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VOLTX® — The Future of Local Experiences",
    description:
      "Technology should bring people closer, not keep them apart. VOLTX is building the future of local experiences.",
    creator: "@voltx",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
  },
};

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "VOLTX",
  alternateName: "VOLTX®",
  url: "https://voltx.io",
  description:
    "VOLTX is building the future of local experiences by helping students, communities, creators, and businesses discover opportunities, meet the right people, and transform digital interactions into meaningful real-world connections.",
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

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Notes App | Bookchaowalit",
  description: "Local notes list with search and markdown-ish body text.",
  keywords: ["notes","localStorage","search"],
  authors: [{ name: "Bookchaowalit", url: "https://bookchaowalit.com" }],
  creator: "Bookchaowalit",
  publisher: "Bookchaowalit",
  metadataBase: new URL("https://bookchaowalit.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Notes App | Bookchaowalit",
    description: "Local notes list with search and markdown-ish body text.",
    siteName: "Bookchaowalit",
  },
  twitter: {
    card: "summary_large_image",
    title: "Notes App | Bookchaowalit",
    description: "Local notes list with search and markdown-ish body text.",
    creator: "@bookchaowalit",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/*
          THESIS: make note-taking feel like leaving a marked leaf in a field book, not filling a SaaS form.
          OWN-WORLD: slate paper, yellow field marks, rust tabs, and a ruled note sheet define the notebook.
          STORY: find a leaf, make a new one, write without ceremony, and remove it when it no longer earns its place.
          FIRST VIEWPORT: the notebook thesis, local-storage boundary, index, search, and active note sheet appear immediately.
          FORM: index tabs, paper writing surface, field labels, and explicit local states define every interaction.
          SEED: f9d83d8c · assigned direction 4 · operate mode.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
        */}
        {children}
      </body>
    </html>
  );
}

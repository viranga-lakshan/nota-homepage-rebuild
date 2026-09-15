import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import { SmoothScrollProvider } from "@/lib/animation/SmoothScrollProvider";
import "../styles/tokens.css";
import "./globals.css";

// Self-hosted at build time (not loaded from Google's CDN at request time) —
// standard next/font/google behaviour, and incidentally the right call for
// a page that must not leak visitor requests to a third party.
//
// Instrument Serif ships one weight (400, regular) — next/font/google
// requires that stated explicitly for non-variable fonts, no implicit
// default. Inter is a variable font, so its whole weight range is
// available without listing each one.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
});

const inter = Inter({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-inter",
});

// Site-wide fallback metadata — individual routes override this via
// generateMetadata(). The homepage (page.tsx) is already wired to the CMS.
// `noIndex` stays true site-wide per CLAUDE.md §2: the reference design
// belongs to its original creators and this rebuild must not be indexed.
export const metadata: Metadata = {
  title: "NŌTA — Smart Pen",
  description: "NŌTA creates tools that respect the way people think and write. Natural handwriting, quietly connected to digital structure.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${inter.variable}`}>
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}

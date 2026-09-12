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
// default. Both styles are loaded: the reference's own Google Fonts
// request (confirmed by fetching its actual <link> tag) includes
// "400,400italic", not normal-only. Inter is a variable font, so its
// whole weight range is available without listing each one.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

const inter = Inter({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-inter",
});

// TODO: title/description will come from the CMS's shared.seo component via
// generateMetadata() once the homepage fetch exists (see CLAUDE.md §2 —
// no content may be hardcoded). The placeholder strings below are scaffold
// only. `robots` is a hard brief requirement and is not a placeholder — see
// CLAUDE.md §2, "the design belongs to its original creators".
export const metadata: Metadata = {
  title: "NŌTA homepage rebuild (scaffold)",
  description: "Work in progress — content is not yet wired to the CMS.",
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

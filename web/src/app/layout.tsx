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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { Roboto, Montserrat, PT_Mono } from "next/font/google";
import { Footer } from "@/features/nav/ui/Footer";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const ptMono = PT_Mono({
  variable: "--font-pt-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Tech Jobs Trends · LATAM",
  description: "Market intelligence from 5,000+ LATAM tech job postings. Skills, salaries, roles, and distributions.",
};

function FooterFallback() {
  return (
    <footer className="border-t border-[var(--border)] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12" />
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${roboto.variable} ${montserrat.variable} ${ptMono.variable} h-full`}>
      <body className="min-h-full bg-[var(--surface)] text-[var(--text)] antialiased font-sans flex flex-col">
        {children}
        <Suspense fallback={<FooterFallback />}>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}

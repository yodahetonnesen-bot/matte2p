import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { CommandPalette } from "@/components/site/command-palette";
import { Sidebruk } from "@/components/site/sidebruk";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-display", subsets: ["latin"], axes: ["opsz", "SOFT"] });

export const metadata: Metadata = {
  title: { default: "2P Matte – interaktiv teori, oppgaver og fasit", template: "%s · 2P Matte" },
  description:
    "Lær matematikk 2P: prosent, likninger, økonomi, statistikk og geometri – med forklaringer, eksempler, interaktive figurer, oppgaver med fasit og automatisk rettet trening.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf6" },
    { media: "(prefers-color-scheme: dark)", color: "#14161f" },
  ],
};

const themeScript = `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nb" data-scroll-behavior="smooth" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a href="#innhold" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-card focus:px-4 focus:py-2">
          Hopp til innhold
        </a>
        <SiteHeader />
        <main id="innhold" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <CommandPalette />
        <Sidebruk />
      </body>
    </html>
  );
}

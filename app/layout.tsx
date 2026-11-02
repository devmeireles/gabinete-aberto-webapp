import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { TRPCReactProvider } from "./lib/trpc/client";
import { GoogleAnalytics } from "./components/layout/GoogleAnalytics";
import { RouteTitleFallback } from "./components/layout/RouteTitleFallback";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: {
    default: "Gabinete Aberto",
    template: "%s | Gabinete Aberto",
  },
  description:
    "Explore dados públicos da Câmara dos Deputados: parlamentares, fornecedores e despesas da Cota Parlamentar (CEAP).",
  applicationName: "Gabinete Aberto",
  keywords: [
    "dados abertos",
    "Câmara dos Deputados",
    "deputados federais",
    "despesas parlamentares",
    "CEAP",
    "Cota Parlamentar",
  ],
  openGraph: {
    title: "Gabinete Aberto",
    description:
      "Explore dados públicos da Câmara dos Deputados: parlamentares, fornecedores e despesas da Cota Parlamentar (CEAP).",
    type: "website",
    locale: "pt_BR",
    siteName: "Gabinete Aberto",
  },
  twitter: {
    card: "summary",
    title: "Gabinete Aberto",
    description:
      "Explore dados públicos da Câmara dos Deputados: parlamentares, fornecedores e despesas da Cota Parlamentar (CEAP).",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        <Suspense fallback={null}>
          <RouteTitleFallback />
        </Suspense>
        <GoogleAnalytics />
        <TRPCReactProvider>
          <div className="flex min-h-screen flex-col bg-(--color-background) text-text">
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>

            <Footer />
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { TRPCReactProvider } from "./lib/trpc/client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gabinete Aberto | Dados Abertos da Câmara",
  description:
    "Consulte deputados federais, perfis, histórico partidário e despesas da CEAP.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
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

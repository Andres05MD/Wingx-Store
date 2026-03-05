import type { Metadata } from "next";
import { DM_Sans, Sora } from "next/font/google";
import "./globals.css";
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { ExchangeRateProvider } from "@/context/ExchangeRateContext";
import { ChatProvider } from "@/context/ChatContext";
import ClientShell from "@/components/ClientShell";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://wingx-store.vercel.app'),
  title: {
    default: "Wingx Store — Moda Exclusiva y Confección Propia",
    template: "%s | Wingx Store",
  },
  description: "Moda moderna y exclusiva con confección propia. Diseños únicos, calidad premium y envíos a todo el país. Descubre tu estilo en Wingx.",
  keywords: ['moda', 'ropa', 'tienda online', 'Venezuela', 'confección propia', 'Wingx', 'moda exclusiva', 'Barquisimeto'],
  icons: {
    icon: 'https://ik.imagekit.io/xwym4oquc/resources/Isotipo.png',
    shortcut: 'https://ik.imagekit.io/xwym4oquc/resources/Isotipo.png',
    apple: 'https://ik.imagekit.io/xwym4oquc/resources/Isotipo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'es_VE',
    siteName: 'Wingx Store',
    title: 'Wingx Store — Moda Exclusiva y Confección Propia',
    description: 'Moda moderna y exclusiva con confección propia. Diseños únicos, calidad premium y envíos a todo el país.',
    images: [
      {
        url: 'https://ik.imagekit.io/xwym4oquc/resources/Isotipo.png',
        width: 512,
        height: 512,
        alt: 'Wingx Store Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wingx Store — Moda Exclusiva',
    description: 'Diseños únicos, calidad premium y envíos a todo el país.',
    images: ['https://ik.imagekit.io/xwym4oquc/resources/Isotipo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${sora.variable} antialiased min-h-screen flex flex-col bg-white text-black dark:bg-black dark:text-white transition-colors duration-300 font-sans`}>
        <AuthProvider>
          <ExchangeRateProvider>
            <ChatProvider>
              <CartProvider>
                <WishlistProvider>
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    disableTransitionOnChange
                  >
                    <Header />

                    <main className="grow w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-6 pb-24 md:pb-4">
                      {children}
                    </main>

                    <Footer />
                    <ClientShell />
                  </ThemeProvider>
                </WishlistProvider>
              </CartProvider>
            </ChatProvider>
          </ExchangeRateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import ParticlesBackground from "@/components/ui/ParticlesBackground";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import ChatBot from "@/components/ChatBot";
import SmoothScroll from "@/components/SmoothScroll";
import MobileBottomNav from "@/components/MobileBottomNav";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import { WishlistProvider } from "@/context/WishlistContext";
import WishlistDrawer from "@/components/WishlistDrawer";
import { AuthProvider } from "@/context/AuthContext";
import { ExchangeRateProvider } from "@/context/ExchangeRateContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wingx Store",
  description: "Moda moderna y exclusiva",
  icons: {
    icon: 'https://ik.imagekit.io/xwym4oquc/resources/Isotipo.png',
    shortcut: 'https://ik.imagekit.io/xwym4oquc/resources/Isotipo.png',
    apple: 'https://ik.imagekit.io/xwym4oquc/resources/Isotipo.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${outfit.variable} antialiased min-h-screen flex flex-col bg-white text-black dark:bg-black dark:text-white transition-colors duration-300 font-sans`}>
        <AuthProvider>
          <ExchangeRateProvider>
            <CartProvider>
              <WishlistProvider>
                <SmoothScroll />
                <ThemeProvider
                  attribute="class"
                  defaultTheme="dark"
                  enableSystem
                  disableTransitionOnChange
                >
                  <ParticlesBackground />
                  <Header />

                  <main className="flex-grow w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
                    {children}
                  </main>

                  <CartDrawer />
                  <WishlistDrawer />
                  <Footer />
                  <MobileBottomNav />
                  <ChatBot />
                  <Toaster position="top-center" richColors />
                </ThemeProvider>
              </WishlistProvider>
            </CartProvider>
          </ExchangeRateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

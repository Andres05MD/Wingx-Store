'use client';

import dynamic from 'next/dynamic';

// Dynamic imports — componentes pesados que no necesitan SSR
const ParticlesBackground = dynamic(() => import("@/components/ui/ParticlesBackground"), { ssr: false });
const ChatBot = dynamic(() => import("@/components/ChatBot"), { ssr: false });
const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), { ssr: false });
const MobileBottomNav = dynamic(() => import("@/components/MobileBottomNav"), { ssr: false });
const CartDrawer = dynamic(() => import("@/components/CartDrawer"), { ssr: false });
const WishlistDrawer = dynamic(() => import("@/components/WishlistDrawer"), { ssr: false });
const Toaster = dynamic(() => import("sonner").then(m => m.Toaster), { ssr: false });

/**
 * Wrapper cliente que carga componentes pesados de forma lazy.
 * Esto reduce el bundle inicial significativamente (~70KB+).
 */
export default function ClientShell() {
    return (
        <>
            <SmoothScroll />
            <ParticlesBackground />
            <CartDrawer />
            <WishlistDrawer />
            <MobileBottomNav />
            <ChatBot />
            <Toaster position="top-center" richColors />
        </>
    );
}

'use client';

import dynamic from 'next/dynamic';
import { useRendimiento } from '@/context/RendimientoContext';
import { useState, useEffect } from 'react';

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
    const { esBajoRendimiento, priorizarCargaLimpia } = useRendimiento();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // En móviles o equipos lentos, diferimos la carga de widgets no críticos
        const timer = setTimeout(() => {
            setMounted(true);
        }, priorizarCargaLimpia ? 2000 : 500);

        return () => clearTimeout(timer);
    }, [priorizarCargaLimpia]);

    return (
        <>
            {!esBajoRendimiento && <SmoothScroll />}
            {!esBajoRendimiento && <ParticlesBackground />}
            <CartDrawer />
            <WishlistDrawer />
            <MobileBottomNav />
            {mounted && <ChatBot />}
            <Toaster position="top-center" richColors />
        </>
    );
}

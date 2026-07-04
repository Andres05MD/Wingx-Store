'use client';

import dynamic from 'next/dynamic';
import { MotionConfig } from 'framer-motion';
import { useRendimiento } from '@/context/RendimientoContext';
import { useState, useEffect, ComponentType } from 'react';

const ChatBot = dynamic(() => import("@/components/ChatBot"), { ssr: false });
const MobileBottomNav = dynamic(() => import("@/components/MobileBottomNav"), { ssr: false });
const CartDrawer = dynamic(() => import("@/components/CartDrawer"), { ssr: false });
const WishlistDrawer = dynamic(() => import("@/components/WishlistDrawer"), { ssr: false });
const Toaster = dynamic(() => import("sonner").then(m => m.Toaster), { ssr: false });

export default function ClientShell() {
    const { esBajoRendimiento, priorizarCargaLimpia } = useRendimiento();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
        }, priorizarCargaLimpia ? 2000 : 500);

        return () => clearTimeout(timer);
    }, [priorizarCargaLimpia]);

    return (
        <MotionConfig reducedMotion={esBajoRendimiento ? "always" : "user"}>
            {!esBajoRendimiento && (
                <SmoothScrollDynamic />
            )}
            <CartDrawer />
            <WishlistDrawer />
            <MobileBottomNav />
            {mounted && <ChatBot />}
            <Toaster position="top-center" richColors />
        </MotionConfig>
    );
}

function SmoothScrollDynamic() {
    const [LenisComponent, setLenisComponent] = useState<ComponentType | null>(null);

    useEffect(() => {
        import("@/components/SmoothScroll").then((mod) => {
            setLenisComponent(() => mod.default);
        });
    }, []);

    if (!LenisComponent) return null;
    return <LenisComponent />;
}

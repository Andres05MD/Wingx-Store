'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Search, Heart, ShoppingCart, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useChat } from '@/context/ChatContext';
import { useEffect, useState } from 'react';

export default function MobileBottomNav() {
    const pathname = usePathname();
    const { setIsCartOpen, totalItems } = useCart();
    const { setIsWishlistOpen, wishlist } = useWishlist();
    const { toggleChat } = useChat();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isActive = (path?: string) => {
        if (!path) return false;
        if (path === '/') return pathname === '/';
        return pathname?.startsWith(path);
    };

    // Items de navegación principal (dentro de la píldora)
    const navItems = [
        {
            name: 'Inicio',
            href: '/',
            icon: Home,
            type: 'link' as const
        },
        {
            name: 'Catálogo',
            href: '/catalogo',
            icon: LayoutGrid,
            type: 'link' as const
        },
        {
            name: 'Deseos',
            action: () => setIsWishlistOpen(true),
            icon: Heart,
            type: 'button' as const,
            count: wishlist.length
        },
        {
            name: 'Ayuda',
            action: toggleChat,
            icon: MessageCircle,
            type: 'button' as const
        },
    ];

    if (!mounted) return null;

    return (
        <nav className="md:hidden fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-3 right-3 z-50 pointer-events-none">
            <div className="mx-auto max-w-sm pointer-events-auto flex items-center gap-2.5">

                {/* Píldora principal de navegación */}
                <div className="relative flex-1 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-black/8 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] rounded-full overflow-hidden">
                    {/* Textura sutil */}
                    <div className="absolute inset-0 bg-noise opacity-[0.01] dark:opacity-[0.03] pointer-events-none rounded-full" />

                    <div className="flex items-center justify-around h-14 px-1.5 relative z-10">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = item.type === 'link' ? isActive(item.href) : false;

                            const innerContent = (
                                <motion.div
                                    className="relative flex items-center justify-center"
                                    layout
                                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                >
                                    {/* Fondo activo tipo píldora */}
                                    <AnimatePresence>
                                        {active && (
                                            <motion.div
                                                layoutId="activePill"
                                                className="absolute inset-0 -mx-2 -my-0.5 bg-neutral-100 dark:bg-white/10 rounded-full"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                            />
                                        )}
                                    </AnimatePresence>

                                    <div className="relative z-10 flex items-center gap-1.5 px-3 py-2">
                                        <Icon
                                            className={`w-[20px] h-[20px] transition-colors duration-200 ${active
                                                    ? 'text-black dark:text-white'
                                                    : 'text-neutral-400 dark:text-neutral-500'
                                                }`}
                                            strokeWidth={active ? 2.5 : 1.8}
                                            fill={active && item.name === 'Inicio' ? 'currentColor' : 'none'}
                                        />

                                        {/* Label visible solo cuando está activo */}
                                        <AnimatePresence>
                                            {active && (
                                                <motion.span
                                                    initial={{ width: 0, opacity: 0 }}
                                                    animate={{ width: 'auto', opacity: 1 }}
                                                    exit={{ width: 0, opacity: 0 }}
                                                    transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
                                                    className="text-[13px] font-semibold text-black dark:text-white whitespace-nowrap overflow-hidden"
                                                >
                                                    {item.name}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Badge para items con conteo */}
                                    <AnimatePresence>
                                        {item.count && item.count > 0 ? (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                className="absolute -top-1 -right-0.5 bg-red-500 text-white text-[8px] font-bold h-3.5 min-w-[14px] flex items-center justify-center rounded-full px-0.5 shadow-sm"
                                            >
                                                {item.count > 9 ? '9+' : item.count}
                                            </motion.div>
                                        ) : null}
                                    </AnimatePresence>
                                </motion.div>
                            );

                            if (item.type === 'link' && item.href) {
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="relative flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
                                        aria-label={item.name}
                                    >
                                        {innerContent}
                                    </Link>
                                );
                            }

                            return (
                                <button
                                    key={item.name}
                                    onClick={item.action}
                                    className="relative flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
                                    aria-label={item.name}
                                >
                                    {innerContent}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Botón de carrito separado (círculo flotante) */}
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative w-14 h-14 flex items-center justify-center bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-black/8 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] rounded-full active:scale-95 transition-transform cursor-pointer shrink-0"
                    aria-label="Carrito de compras"
                >
                    <ShoppingCart
                        className="w-[20px] h-[20px] text-neutral-700 dark:text-neutral-300"
                        strokeWidth={1.8}
                    />

                    {/* Badge del carrito */}
                    <AnimatePresence>
                        {totalItems > 0 && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold h-[18px] min-w-[18px] flex items-center justify-center rounded-full px-1 shadow-sm border-2 border-white dark:border-neutral-900"
                            >
                                {totalItems > 9 ? '9+' : totalItems}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </nav>
    );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, ShoppingCart, Heart, MessageCircle } from 'lucide-react';
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
        if (path === '/') {
            return pathname === '/';
        }
        return pathname?.startsWith(path);
    };

    const navItems = [
        {
            name: 'Deseos',
            action: () => setIsWishlistOpen(true),
            icon: Heart,
            type: 'button',
            count: wishlist.length
        },
        {
            name: 'Carrito',
            action: () => setIsCartOpen(true),
            icon: ShoppingCart,
            type: 'button',
            count: totalItems
        },
        {
            name: 'Inicio',
            href: '/',
            icon: Home,
            type: 'link'
        },
        {
            name: 'Catálogo',
            href: '/catalogo',
            icon: LayoutGrid,
            type: 'link'
        },
        {
            name: 'Ayuda',
            action: toggleChat,
            icon: MessageCircle,
            type: 'button'
        },
    ];

    if (!mounted) return null;

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border-t border-neutral-100 dark:border-white/10 safe-area-bottom">
            <div className="grid grid-cols-5 h-16 mx-auto px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = item.type === 'link' ? isActive(item.href) : false;

                    const content = (
                        <>
                            {/* Active indicator */}
                            {active && (
                                <motion.span
                                    layoutId="activeTab"
                                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-black dark:bg-white rounded-b-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            {/* Icon Wrapper */}
                            <div className="relative">
                                <motion.div
                                    animate={{
                                        scale: active ? 1.2 : 1,
                                        y: active ? -2 : 0
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    <Icon
                                        className={`w-6 h-6 transition-colors duration-300 ${active
                                            ? 'text-black dark:text-white fill-current' // Optional: fill icon when active if supported/desired
                                            : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'
                                            }`}
                                        strokeWidth={active ? 2.5 : 2}
                                        fill={active && item.name === 'Inicio' ? 'currentColor' : 'none'}
                                    />
                                </motion.div>

                                {/* Badge */}
                                <AnimatePresence>
                                    {item.count && item.count > 0 ? (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute -top-2 -right-2 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-white dark:border-neutral-900"
                                        >
                                            {item.count > 9 ? '9+' : item.count}
                                        </motion.div>
                                    ) : null}
                                </AnimatePresence>
                            </div>

                            {/* Label */}
                            <span
                                className={`text-[10px] font-medium mt-0.5 transition-colors duration-300 ${active
                                    ? 'text-black dark:text-white'
                                    : 'text-neutral-500 dark:text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300'
                                    }`}
                            >
                                {item.name}
                            </span>
                        </>
                    );

                    if (item.type === 'link' && item.href) {
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="relative flex flex-col items-center justify-center py-1 group active:scale-95 transition-transform w-full"
                            >
                                {content}
                            </Link>
                        );
                    }

                    return (
                        <button
                            key={item.name}
                            onClick={item.action}
                            className="relative flex flex-col items-center justify-center py-1 group active:scale-95 transition-transform w-full"
                        >
                            {content}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileBottomNav() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/') {
            return pathname === '/';
        }
        return pathname?.startsWith(path);
    };

    const navItems = [
        {
            name: 'Inicio',
            href: '/',
            icon: Home,
        },
        {
            name: 'Catálogo',
            href: '/catalogo',
            icon: ShoppingBag,
        },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-lg border-t border-black/10 dark:border-white/10 safe-area-bottom">
            <div className="grid grid-cols-2 h-16 max-w-md mx-auto px-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative flex flex-col items-center justify-center gap-1 group"
                        >
                            {/* Active indicator */}
                            {active && (
                                <motion.span
                                    layoutId="activeTab"
                                    className="absolute top-0 left-0 right-0 h-0.5 bg-black dark:bg-white rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            {/* Icon */}
                            <motion.div
                                animate={{
                                    scale: active ? 1.1 : 1,
                                    y: active ? -2 : 0
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <Icon
                                    className={`w-5 h-5 transition-colors ${active
                                            ? 'text-black dark:text-white'
                                            : 'text-neutral-500 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white'
                                        }`}
                                    strokeWidth={active ? 2.5 : 2}
                                />
                            </motion.div>

                            {/* Label */}
                            <span
                                className={`text-xs transition-colors ${active
                                        ? 'text-black dark:text-white font-semibold'
                                        : 'text-neutral-500 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white'
                                    }`}
                            >
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

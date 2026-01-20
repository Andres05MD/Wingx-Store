'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreadcrumbsProps {
    items: {
        label: string;
        href?: string;
    }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 text-sm mb-6 overflow-x-auto pb-2 scrollbar-hide"
            aria-label="Breadcrumb"
        >
            <Link
                href="/"
                className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors flex-shrink-0"
            >
                <Home className="w-4 h-4" />
                <span>Inicio</span>
            </Link>

            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <div key={index} className="flex items-center gap-2 flex-shrink-0">
                        <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-neutral-600" />
                        {item.href && !isLast ? (
                            <Link
                                href={item.href}
                                className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-black dark:text-white font-medium">
                                {item.label}
                            </span>
                        )}
                    </div>
                );
            })}
        </motion.nav>
    );
}

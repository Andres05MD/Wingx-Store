'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartIcon() {
    const { setIsCartOpen, totalItems } = useCart();

    return (
        <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors group"
        >
            <ShoppingCart className="w-6 h-6 text-neutral-900 dark:text-white group-hover:scale-110 transition-transform" />

            <AnimatePresence>
                {totalItems > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white dark:border-black"
                    >
                        {totalItems}
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
}

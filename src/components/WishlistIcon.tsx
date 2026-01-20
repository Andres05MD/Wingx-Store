'use client';

import { useWishlist } from '@/context/WishlistContext';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WishlistIcon() {
    const { setIsWishlistOpen, wishlist } = useWishlist();
    const count = wishlist.length;

    return (
        <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors group"
        >
            <Heart className="w-6 h-6 text-neutral-900 dark:text-white group-hover:scale-110 transition-transform" />

            <AnimatePresence>
                {count > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white dark:border-black"
                    >
                        {count}
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
}

'use client';

import { useWishlist } from '@/context/WishlistContext';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Trash2, ShoppingCart, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';

export default function WishlistDrawer() {
    const {
        isWishlistOpen,
        setIsWishlistOpen,
        wishlist,
        removeFromWishlist
    } = useWishlist();

    const { addToCart } = useCart();
    const drawerRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const isBrowserNavigation = useRef(false);

    // Format currency
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(price);
    };

    // Handle mobile back gesture
    useEffect(() => {
        if (!isWishlistOpen) return;

        // Reset flag and visibility style immediately upon opening
        isBrowserNavigation.current = false;
        if (drawerRef.current) {
            drawerRef.current.style.display = '';
            drawerRef.current.style.opacity = '';
        }
        if (backdropRef.current) {
            backdropRef.current.style.display = '';
            backdropRef.current.style.opacity = '';
        }

        // Add state to history when drawer opens
        window.history.pushState({ wishlistOpen: true }, '');

        const handlePopState = () => {
            // Mark as browser navigation
            isBrowserNavigation.current = true;

            // AGGRESSIVE FIX for iOS flicker: Remove from flow immediately
            if (drawerRef.current) drawerRef.current.style.display = 'none';
            if (backdropRef.current) backdropRef.current.style.display = 'none';

            // Close drawer when user navigates back
            setIsWishlistOpen(false);
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [isWishlistOpen, setIsWishlistOpen]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
                // Go back in history to remove the pushed state
                window.history.back();
            }
        };

        if (isWishlistOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isWishlistOpen, setIsWishlistOpen]);

    // Handler to close drawer via X button (needs to go back in history)
    const handleClose = () => {
        window.history.back();
    };

    return (
        <AnimatePresence>
            {isWishlistOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        ref={backdropRef}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                        aria-hidden="true"
                    />

                    {/* Drawer */}
                    <motion.div
                        ref={drawerRef}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={isBrowserNavigation.current ? { opacity: 0, transition: { duration: 0 } } : { x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white dark:bg-neutral-900 shadow-2xl z-[60] flex flex-col border-l border-neutral-200 dark:border-neutral-800"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-500 text-white p-2 rounded-lg">
                                    <Heart size={20} fill="currentColor" />
                                </div>
                                <h2 className="text-xl font-bold font-heading">Lista de Deseos ({wishlist.length})</h2>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X size={24} className="text-neutral-500" />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {wishlist.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                    <div className="w-16 h-16 bg-neutral-100 dark:bg-white/5 rounded-full flex items-center justify-center">
                                        <Heart size={32} className="text-neutral-400" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-medium text-neutral-900 dark:text-white">Tu lista está vacía</p>
                                        <p className="text-neutral-500 text-sm mt-1">Guarda lo que te gusta para no perderlo de vista.</p>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                    >
                                        Explorar productos
                                    </button>
                                </div>
                            ) : (
                                wishlist.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex gap-4 p-4 rounded-xl border border-neutral-100 dark:border-white/5 bg-neutral-50/50 dark:bg-white/[0.02]"
                                    >
                                        <Link
                                            href={`/productos/${item.id}`}
                                            onClick={() => setIsWishlistOpen(false)}
                                            className="relative w-24 h-28 flex-shrink-0 bg-neutral-100 dark:bg-white/5 rounded-lg overflow-hidden group"
                                        >
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                sizes="100px"
                                            />
                                        </Link>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start gap-2">
                                                    <Link
                                                        href={`/productos/${item.id}`}
                                                        onClick={() => setIsWishlistOpen(false)}
                                                    >
                                                        <h3 className="font-semibold text-neutral-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                                            {item.name}
                                                        </h3>
                                                    </Link>
                                                    <button
                                                        onClick={() => removeFromWishlist(item.id)}
                                                        className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <p className="font-bold text-neutral-900 dark:text-white mt-1">
                                                    {formatPrice(item.price)}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    // Add to cart and potentially remove from wishlist
                                                    addToCart(item);
                                                    removeFromWishlist(item.id);
                                                }}
                                                className="flex items-center justify-center gap-2 w-full py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                                            >
                                                <ShoppingCart size={14} />
                                                Mover al carrito
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

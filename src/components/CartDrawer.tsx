'use client';

import { useCart } from '@/context/CartContext';
import { useExchangeRate } from '@/context/ExchangeRateContext';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingCart, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import PremiumButton from './PremiumButton';
import { useEffect, useRef, useState } from 'react';
import CheckoutModal from './CheckoutModal';

export default function CartDrawer() {
    const {
        isCartOpen,
        setIsCartOpen,
        items,
        removeFromCart,
        updateQuantity,
        totalPrice,
        totalItems,
        clearCart
    } = useCart();
    const { formatBs } = useExchangeRate();

    const drawerRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const isBrowserNavigation = useRef(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

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
        if (!isCartOpen) return;

        // Reset flag and visibility style
        isBrowserNavigation.current = false;

        // Add state to history when drawer opens
        window.history.pushState({ cartOpen: true }, '');

        const handlePopState = (event: PopStateEvent) => {
            // Mark as browser navigation
            isBrowserNavigation.current = true;

            // IMMEDIATE FIX for iOS flicker: Hide elements directly via DOM
            // This prevents React from rendering a 'ghost' frame during the transition
            if (drawerRef.current) drawerRef.current.style.opacity = '0';
            if (backdropRef.current) backdropRef.current.style.opacity = '0';

            // Close drawer when user navigates back
            setIsCartOpen(false);
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [isCartOpen, setIsCartOpen]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
                // Go back in history to remove the pushed state
                window.history.back();
            }
        };

        if (isCartOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            // Only reset overflow if drawer is closing and modal is NOT open
            if (!isCheckoutOpen) {
                document.body.style.overflow = 'unset';
            }
        };
    }, [isCartOpen, setIsCartOpen, isCheckoutOpen]);

    // Handler to close drawer via X button (needs to go back in history)
    const handleClose = () => {
        window.history.back();
    };

    const handleCheckout = () => {
        setIsCheckoutOpen(true);
        // Go back in history to remove the cart drawer state, then close
        window.history.back();
    };

    return (
        <>
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div key="backdrop"
                            ref={backdropRef}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                            aria-hidden="true"
                        />

                        {/* Drawer */}
                        <motion.div key="drawer"
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
                                    <div className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-lg">
                                        <ShoppingCart size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold font-heading">Tu Carrito ({totalItems})</h2>
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
                                {items.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                        <div className="w-16 h-16 bg-neutral-100 dark:bg-white/5 rounded-full flex items-center justify-center">
                                            <ShoppingCart size={32} className="text-neutral-400" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-medium text-neutral-900 dark:text-white">Tu carrito está vacío</p>
                                            <p className="text-neutral-500 text-sm mt-1">¡Explora nuestro catálogo y añade algo increíble!</p>
                                        </div>
                                        <button
                                            onClick={handleClose}
                                            className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                        >
                                            Seguir comprando
                                        </button>
                                    </div>
                                ) : (
                                    items.map((item) => (
                                        <motion.div
                                            layout
                                            key={item.cartItemId}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex gap-4 p-4 rounded-xl border border-neutral-100 dark:border-white/5 bg-neutral-50/50 dark:bg-white/[0.02]"
                                        >
                                            <div className="relative w-20 h-24 flex-shrink-0 bg-neutral-100 dark:bg-white/5 rounded-lg overflow-hidden">
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="80px"
                                                />
                                            </div>

                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start gap-2">
                                                        <h3 className="font-semibold text-neutral-900 dark:text-white line-clamp-2">{item.name}</h3>
                                                        <button
                                                            onClick={() => removeFromCart(item.cartItemId)}
                                                            className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                    {item.selectedSize && (
                                                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                                            Talla: <span className="font-medium text-neutral-900 dark:text-neutral-200">{item.selectedSize}</span>
                                                        </p>
                                                    )}
                                                    {item.selectedColor && (
                                                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                                            Color: <span className="font-medium text-neutral-900 dark:text-neutral-200">{item.selectedColor}</span>
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between mt-3">
                                                    <p className="font-bold text-neutral-900 dark:text-white">
                                                        {formatPrice(item.price)}
                                                    </p>

                                                    <div className="flex items-center gap-3 bg-white dark:bg-black rounded-full border border-neutral-200 dark:border-white/10 px-2 py-1">
                                                        <button
                                                            onClick={() => updateQuantity(item.cartItemId, -1)}
                                                            disabled={item.quantity <= 1}
                                                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 disabled:opacity-30 transition-colors"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.cartItemId, 1)}
                                                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {/* Footer / Checkout */}
                            {items.length > 0 && (
                                <div className="p-6 border-t border-neutral-100 dark:border-white/5 bg-white dark:bg-neutral-900 space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-neutral-500 dark:text-neutral-400">
                                            <span>Subtotal</span>
                                            <span>{formatPrice(totalPrice)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xl font-bold text-neutral-900 dark:text-white pt-2 border-t border-dashed border-neutral-200 dark:border-white/10">
                                            <span>Total</span>
                                            <div className="flex flex-col items-end">
                                                <span>{formatPrice(totalPrice)}</span>
                                                <span className="text-sm font-normal text-neutral-500">{formatBs(totalPrice)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <PremiumButton onClick={handleCheckout} className="w-full">
                                            <div className="flex items-center justify-center gap-2">
                                                <MessageCircle className="w-5 h-5" />
                                                <span>Completar Pago</span>
                                            </div>
                                        </PremiumButton>

                                        <button
                                            onClick={clearCart}
                                            className="w-full text-center text-xs text-neutral-400 hover:text-red-500 mt-4 transition-colors"
                                        >
                                            Vaciar carrito
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
        </>
    );
}

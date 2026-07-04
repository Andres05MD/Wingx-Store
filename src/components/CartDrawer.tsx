'use client';

import { useCart } from '@/context/CartContext';
import { useExchangeRate } from '@/context/ExchangeRateContext';
import { Trash2, Plus, Minus, ShoppingCart, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import PremiumButton from './PremiumButton';
import { useState, useEffect } from 'react';
import CheckoutModal from './CheckoutModal';
import Drawer from '@/components/ui/Drawer';
import { formatPrice } from '@/lib/utils';

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
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    useEffect(() => {
        if (!isCheckoutOpen) {
            document.body.style.overflow = 'unset';
        }
    }, [isCheckoutOpen]);

    const handleCheckout = () => {
        setIsCheckoutOpen(true);
        window.history.back();
    };

    return (
        <>
            <Drawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                title="Tu Carrito"
                icon={ShoppingCart}
                count={totalItems}
            >
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length > 0 && (
                        <div className="bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl p-3 text-sm flex gap-3 items-center shadow-md">
                            <span className="text-lg">✨</span>
                            <p className="leading-tight">
                                Tus prendas serán <span className="font-bold">confeccionadas a medida</span>.
                                Tiempo estimado: <span className="font-bold underline decoration-white/30 dark:decoration-black/30 underline-offset-2">5-7 días hábiles</span>.
                            </p>
                        </div>
                    )}

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
                                onClick={() => setIsCartOpen(false)}
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                            >
                                Seguir comprando
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div
                                key={item.cartItemId}
                                className="flex gap-4 p-4 rounded-xl border border-neutral-100 dark:border-white/5 bg-neutral-50/50 dark:bg-white/[0.02]"
                            >
                                <div className="relative w-20 h-24 flex-shrink-0 bg-neutral-100 dark:bg-white/5 rounded-lg overflow-hidden">
                                    <Image
                                        src={item.imageUrl || '/no-image.svg'}
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
                            </div>
                        ))
                    )}
                </div>

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
            </Drawer>
            <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
        </>
    );
}

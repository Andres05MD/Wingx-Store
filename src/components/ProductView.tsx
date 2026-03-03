'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { MessageCircle, ShoppingCart, Scissors, Check, Truck, ShieldCheck, Star } from 'lucide-react';
import PremiumButton from './PremiumButton';
import ScrollReveal from './ScrollReveal';
import ImageGallery from './ImageGallery';
import { useCart } from '@/context/CartContext';
import RecentlyViewed, { addToRecentlyViewed } from './RecentlyViewed';
import { Heart, Ruler } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useEffect } from 'react';
import SizeGuideModal from './SizeGuideModal';
import { useExchangeRate } from '@/context/ExchangeRateContext';

interface ProductViewProps {
    product: Product;
    relatedProductIds?: string[];
}

// Map of color names to CSS color values
const COLOR_MAP: Record<string, string> = {
    'Negro': '#000000',
    'Blanco': '#FFFFFF',
    'Rojo': '#EF4444',
    'Azul': '#3B82F6',
    'Azul Marino': '#1E3A5F',
    'Azul Cielo': '#87CEEB',
    'Verde': '#22C55E',
    'Verde Oliva': '#556B2F',
    'Amarillo': '#EAB308',
    'Naranja': '#F97316',
    'Rosa': '#EC4899',
    'Morado': '#A855F7',
    'Gris': '#6B7280',
    'Gris Claro': '#D1D5DB',
    'Marrón': '#92400E',
    'Beige': '#D4B896',
    'Crema': '#FFFDD0',
    'Coral': '#FF7F50',
    'Turquesa': '#40E0D0',
    'Lavanda': '#E6E6FA',
    'Borgoña': '#800020',
    'Terracota': '#E2725B',
    'Menta': '#98FF98',
    'Vino': '#722F37',
    'Caqui': '#C3B091'
};

export default function ProductView({ product, relatedProductIds = [] }: ProductViewProps) {
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { convertToBs, formatBs } = useExchangeRate();

    useEffect(() => {
        addToRecentlyViewed(product);
    }, [product]);

    // Fallback to single image if images array is empty or undefined
    const images = (product.images && product.images.length > 0) ? product.images : [product.imageUrl];

    const { addToCart } = useCart();

    const handleAddToCart = () => {
        if (!selectedSize && product.sizes && product.sizes.length > 0) {
            toast.warning('Talla requerida', {
                description: 'Por favor selecciona una talla para continuar.'
            });
            return;
        }

        if (!selectedColor && product.colors && product.colors.length > 0) {
            toast.warning('Color requerido', {
                description: 'Por favor selecciona un color para continuar.'
            });
            return;
        }

        addToCart(product, selectedSize, selectedColor);
    };



    // Precio en bolívares
    const precioEnBs = convertToBs(product.price);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                {/* Image Section with Zoom */}
                <ScrollReveal direction="left">
                    <ImageGallery images={images} productName={product.name} />
                </ScrollReveal>

                {/* Info Section - Sticky on Desktop */}
                <div className="md:sticky md:top-24 h-fit flex flex-col gap-4 md:gap-5 pb-8 md:pb-0">
                    <ScrollReveal delay={0.1} direction="right">
                        <div>
                            {/* Categoría */}
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-xs font-semibold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase mb-2"
                            >
                                {product.category || 'MERCANCÍA GENERAL'}
                            </motion.p>

                            {/* Nombre del producto */}
                            <motion.h1
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-2xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white leading-tight mb-3 md:mb-4"
                            >
                                {product.name}
                            </motion.h1>

                            {/* Precio */}
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-baseline gap-2 md:gap-3 pb-4 md:pb-5 border-b border-neutral-200 dark:border-neutral-800"
                            >
                                <span className="text-2xl md:text-3xl font-bold text-black dark:text-white">
                                    ${product.price}
                                </span>
                                {precioEnBs > 0 && (
                                    <span className="text-sm text-neutral-400 dark:text-neutral-500">
                                        {formatBs(precioEnBs)}
                                    </span>
                                )}
                            </motion.div>
                        </div>
                    </ScrollReveal>

                    {/* Descripción */}
                    <ScrollReveal delay={0.2} direction="right">
                        {product.description ? (
                            <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed tracking-wide">
                                {product.description}
                            </p>
                        ) : null}
                    </ScrollReveal>

                    {/* Sizes Selector */}
                    {product.sizes && product.sizes.length > 0 && (
                        <ScrollReveal delay={0.3} direction="right">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                        Selecciona tu talla
                                        {selectedSize && (
                                            <span className="ml-2 text-black dark:text-white">— {selectedSize}</span>
                                        )}
                                    </span>
                                    <button
                                        onClick={() => setIsSizeGuideOpen(true)}
                                        className="text-xs font-medium text-neutral-500 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                                    >
                                        <Ruler size={13} />
                                        Guía de tallas
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((size) => (
                                        <motion.button
                                            key={size}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedSize(size)}
                                            className={`min-w-[40px] h-10 md:min-w-[48px] md:h-12 px-3 md:px-4 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer
                                                ${selectedSize === size
                                                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg ring-2 ring-black/10 dark:ring-white/10'
                                                    : 'bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
                                                }
                                            `}
                                        >
                                            {size}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </ScrollReveal>
                    )}

                    {/* Colors Selector */}
                    {product.colors && product.colors.length > 0 && (
                        <ScrollReveal delay={0.35} direction="right">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                        Color
                                        {selectedColor && (
                                            <span className="ml-2 text-black dark:text-white">— {selectedColor}</span>
                                        )}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2.5 md:gap-3">
                                    {product.colors.map((color) => {
                                        const combinedColorMap = { ...COLOR_MAP, ...(product.customColorMap || {}) };
                                        const colorValue = combinedColorMap[color] || '#888888';
                                        const isLightColor = ['Blanco', 'Crema', 'Beige', 'Amarillo', 'Gris Claro', 'Lavanda', 'Menta'].includes(color)
                                            || (colorValue.toLowerCase() === '#ffffff' || colorValue.toLowerCase() === '#fffdd0');

                                        return (
                                            <motion.button
                                                key={color}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setSelectedColor(color)}
                                                title={color}
                                                className={`relative w-9 h-9 md:w-11 md:h-11 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer
                                                    ${selectedColor === color
                                                        ? 'ring-2 ring-offset-2 ring-black dark:ring-white dark:ring-offset-neutral-900'
                                                        : 'md:hover:ring-2 md:hover:ring-offset-2 md:hover:ring-black/20 md:dark:hover:ring-white/20 md:dark:hover:ring-offset-neutral-900'
                                                    }
                                                    ${isLightColor ? 'border border-black/15 dark:border-white/15' : ''}
                                                `}
                                                style={{ backgroundColor: colorValue }}
                                            >
                                                {selectedColor === color && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                    >
                                                        <Check size={16} strokeWidth={3} className={isLightColor ? 'text-black/70' : 'text-white/90'} />
                                                    </motion.div>
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                        </ScrollReveal>
                    )}

                    {/* Acciones: Botones + Badge confección */}
                    <ScrollReveal delay={0.4} direction="up">
                        <div className="space-y-3.5 md:space-y-4 pt-1 md:pt-2">
                            {/* Badge de confección bajo pedido */}
                            <div className="bg-neutral-900 dark:bg-white rounded-2xl p-3 md:p-4 flex gap-3 md:gap-4 items-start">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/10 dark:bg-black/10 flex items-center justify-center shrink-0">
                                    <Scissors size={16} className="text-white dark:text-black md:w-[18px] md:h-[18px]" />
                                </div>
                                <div>
                                    <p className="font-bold text-white dark:text-black text-[13px] md:text-sm mb-0.5">Confeccionado bajo pedido</p>
                                    <p className="text-neutral-400 dark:text-neutral-600 text-[11px] md:text-xs leading-relaxed">
                                        Tiempo estimado: <span className="text-white dark:text-black font-semibold">5-7 días hábiles</span> tras el pago.
                                    </p>
                                </div>
                            </div>

                            {/* Botón principal: Agregar al carrito */}
                            <PremiumButton
                                onClick={handleAddToCart}
                                className="w-full"
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <ShoppingCart className="w-5 h-5" />
                                    <span>Agregar al carrito</span>
                                </div>
                            </PremiumButton>

                            {/* Botón wishlist */}
                            <button
                                onClick={() => toggleWishlist(product)}
                                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border transition-all duration-200 font-medium text-sm cursor-pointer active:scale-[0.98] ${isInWishlist(product.id)
                                    ? 'border-black dark:border-white text-black dark:text-white bg-neutral-100 dark:bg-neutral-800'
                                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
                                    }`}
                            >
                                <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                                {isInWishlist(product.id) ? 'En tu lista de deseos' : 'Agregar a lista de deseos'}
                            </button>

                            {/* Trust signals */}
                            <div className="grid grid-cols-3 gap-3 pt-2">
                                <div className="flex flex-col items-center gap-1.5 py-3">
                                    <Scissors size={16} className="text-neutral-400" />
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 text-center leading-tight">Hecho a mano</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5 py-3">
                                    <Truck size={16} className="text-neutral-400" />
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 text-center leading-tight">Envío nacional</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5 py-3">
                                    <ShieldCheck size={16} className="text-neutral-400" />
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 text-center leading-tight">Pago seguro</span>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            <RecentlyViewed excludeProductId={product.id} excludeProductIds={relatedProductIds} />
            <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
        </div>
    );
}
